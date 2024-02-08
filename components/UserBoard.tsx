"use client";
import {
  BoardType,
  ColumnActions,
  ColumnState,
  ColumnType,
  TaskType,
} from "@/utils/types";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useCurrentBoardContext } from "../context/CurrentBoardContext";
import { Suspense, useEffect, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { AddColumnButton } from "./AddColumnButton";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { generateUUID } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { createColumnHandler } from "@/actions/columns";

import {
  useDeleteMutation,
  useInsertMutation,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateColumnIndexes,
  insertColumn,
  updateColumnTitle,
  deleteColumnById,
} from "@/queries/columns";
import { insertTask, updateTaskTitle, deleteTaskById } from "@/queries/tasks";
import useBoardQuery from "@/hooks/use-board-query";
import useColumnsQuery from "@/hooks/use-columns-query";
import useTasksQuery from "@/hooks/use-tasks-query";

export default function UserBoard({ boardId }: { boardId: BoardType["id"] }) {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const {
    data: boardData,
    isLoading: boardLoading,
    isError: boardError,
  } = useBoardQuery(boardId);

  const {
    data: columnsData,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useColumnsQuery(boardId);

  const {
    data: tasksData,
    isLoading: taskLoading,
    isError: taskError,
  } = useTasksQuery(boardId);

  useEffect(() => {
    if (columnsData) {
      setColumns(columnsData);
    }
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [columnsData, tasksData]);

  if (boardLoading || columnsLoading || taskLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-green-700">
        <div className="text-9xl">LOADING...</div>
        <div className="text-4xl">
          Replace me with a cool loading animation!
        </div>
      </div>
    );
  }

  if (boardError || columnsError || taskError) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-9xl">
        Uh oh...
      </div>
    );
  }

  const columnIndexes = columns.map((col) => col.id);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "column") {
      setActiveColumn(active.data.current.column);
      return;
    }

    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
      return;
    }
  };

  const onDragOver = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // TODO: rename variables
    const isActiveTask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveTask) return;

    // task over another task
    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].column_id !== tasks[overIndex].column_id) {
          tasks[activeIndex].column_id = tasks[overIndex].column_id;
          return arrayMove(tasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    // task over column
    const isOverColumn = over.data.current?.type === "column";
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].column_id = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex === overColumnIndex) return;

    // Reorder columns in state
    const newColumns: ColumnType[] = arrayMove(
      columns,
      activeColumnIndex,
      overColumnIndex,
    );
    console.log("new columns: ", newColumns);
    setColumns(newColumns.map((col, index) => ({ ...col, index })));

    // Update column indexes in the database
    await updateColumnIndexes(supabase, newColumns);
  };

  const createNewColumn = async () => {
    const newColumn: ColumnType = {
      id: generateUUID(),
      title: "New Column",
      index: columns.length,
      board_id: boardData!.id,
      user_id: boardData!.user_id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await insertColumn(supabase, newColumn);

    if (error) {
      toast({ description: "Error creating column", variant: "destructive" });
      return;
    } else {
      console.log("new column: ", newColumn);
      setColumns((columns) => [...columns, newColumn]);
    }
  };

  const renameColumn = async (id: string, title: string) => {
    const { data, error } = await updateColumnTitle(supabase, id, title);

    if (error) {
      toast({ description: "Error updating column" });
      return;
    } else {
      toast({ description: "Column updated" });
    }

    const updatedColumns: ColumnType[] = columns.map((col) => {
      if (col.id === id) {
        return { ...col, title };
      }
      return col;
    });
    setColumns(updatedColumns);
  };

  const deleteColumn = async (id: ColumnType["id"]) => {
    const { data, error } = await deleteColumnById(supabase, id);

    if (error) {
      toast({ description: "Error deleting column" });
      return;
    } else {
      toast({ description: "Column deleted" });

      const updatedColumns: ColumnType[] = columns.filter(
        (col) => col.id !== id,
      );
      setColumns(updatedColumns);
    }
  };

  const createNewTask = async (
    columnId: ColumnType["id"],
    title: ColumnType["title"],
  ) => {
    const newTask: TaskType = {
      id: generateUUID(),
      index: 0,
      title: title,
      column_id: columnId,
      board_id: boardId,
      user_id: boardData!.user_id!,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await insertTask(supabase, newTask);

    if (error) {
      toast({ description: "Error creating task", variant: "destructive" });
      return;
    } else {
      setTasks((tasks) => [...tasks, newTask]);
    }
  };

  const renameTask = async (id: TaskType["id"], title: TaskType["title"]) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    console.log("renaming task from userboard with id ", id, title);

    const { data, error } = await updateTaskTitle(supabase, id, title!);

    if (error) {
      toast({ description: error.message });
      return;
    } else {
      toast({ description: "Task updated" });
    }

    const updatedTasks: TaskType[] = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, title };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = async (id: TaskType["id"]) => {
    const { data, error } = await deleteTaskById(supabase, id);

    if (error) {
      toast({ description: "Error deleting task" });
      return;
    } else {
      toast({ description: `'${data.title}' was deleted` });
      const updatedTasks: TaskType[] = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="flex min-h-full w-full overflow-x-auto overflow-y-hidden p-10">
      {columns.length}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <SortableContext items={columnIndexes}>
            {columnsLoading && <div>Loading column...</div>}
            {columns.map((c) => (
              <ColumnContainer
                column={c}
                key={c.id}
                tasks={tasks.filter((t) => t.column_id === c.id)}
                renameColumn={renameColumn}
                deleteColumn={deleteColumn}
                createNewTask={createNewTask}
                renameTask={renameTask}
                deleteTask={deleteTask}
              />
            ))}
          </SortableContext>
          <AddColumnButton onClick={createNewColumn} />
        </div>

        {typeof window === "object" &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.column_id === activeColumn.id,
                  )}
                  renameColumn={renameColumn}
                  deleteColumn={deleteColumn}
                  createNewTask={createNewTask}
                  renameTask={renameTask}
                  deleteTask={deleteTask}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  renameTask={renameTask}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
}
