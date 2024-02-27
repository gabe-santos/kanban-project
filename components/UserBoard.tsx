"use client";
import { BoardType, ColumnType, TaskType } from "@/utils/types";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Suspense, use, useEffect, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { AddColumnButton } from "./AddColumnButton";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { generateUUID } from "@/lib/utils";
import { useSupabaseBrowser } from "@/utils/supabase/client";

import { useQueryClient } from "@tanstack/react-query";

import useBoardQuery from "@/hooks/use-board-query";
import useColumnsQuery from "@/hooks/use-columns-query";
import useTasksQuery from "@/hooks/use-tasks-query";
import useInsertColumnMutation from "@/hooks/use-insert-column-mutation";
import useDeleteColumnMutation from "@/hooks/use-delete-column-mutation";
import useUpdateColumnTitleMutation from "@/hooks/use-update-column-title-mutation";
import useUpdateColumnIndexesMutation from "@/hooks/use-update-column-indexes-mutation";
import useInsertTaskMutation from "@/hooks/use-insert-task-mutation";
import useUpdateTaskTitleMutation from "@/hooks/use-update-task-title-mutation";
import useDeleteTaskMutation from "@/hooks/use-delete-task-mutation";
import useUpdateTaskColumnIdMutation from "@/hooks/use-update-task-column-id";
import useUpdateTaskIndexesMutation from "@/hooks/use-update-task-indexes-mutation";
import useReindexTasksByColumnMutation from "@/hooks/use-reindex-tasks-by-column-mutation";

export default function UserBoard({ boardId }: { boardId: BoardType["id"] }) {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

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
    isSuccess: taskSuccess,
  } = useTasksQuery(boardId);

  // Column mutations
  const { mutate: insertColumn } = useInsertColumnMutation(supabase);
  const { mutate: deleteColumn } = useDeleteColumnMutation(supabase);
  const { mutate: updateColumnTitle } = useUpdateColumnTitleMutation(supabase);
  const { mutate: updateColumnIndexes } =
    useUpdateColumnIndexesMutation(supabase);

  // Task mutations
  const { mutate: insertTask } = useInsertTaskMutation(supabase);
  const { mutate: updateTaskTitle } = useUpdateTaskTitleMutation(supabase);
  const { mutate: deleteTask } = useDeleteTaskMutation(supabase);
  const { mutate: updateTaskColumnId } =
    useUpdateTaskColumnIdMutation(supabase);
  const { mutate: updateTaskIndexes } = useUpdateTaskIndexesMutation(supabase);
  const { mutate: reindexTasksByColumn } =
    useReindexTasksByColumnMutation(supabase);

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

  if (
    !boardData ||
    !columns ||
    !tasks ||
    boardError ||
    columnsError ||
    taskError
  ) {
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
    if (!over) return; // if not over anything, return

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return; // if active and over are the same, return

    const isActiveTask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveTask) return; // if not a task, return

    // task over another task
    if (isActiveTask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      let newTasks = [...tasks];

      if (tasks[activeIndex].column_id != tasks[overIndex].column_id) {
        tasks[activeIndex].column_id = tasks[overIndex].column_id;
        newTasks = arrayMove(tasks, activeIndex, overIndex);
      } else {
        newTasks = arrayMove(tasks, activeIndex, overIndex);
      }
      // create a new array with the updated indexes
      const reindexedTasks = newTasks.map((task, index) => ({
        ...task,
        index,
      }));
      setTasks(reindexedTasks);
    }

    // task over column
    const isOverColumn = over.data.current?.type === "column";
    if (isActiveTask && isOverColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      tasks[activeIndex].column_id = overId.toString();
      tasks[activeIndex].index = 0;

      const newTasks = arrayMove(tasks, activeIndex, activeIndex);
      setTasks(newTasks);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const taskMovement = event.active.data.current?.type === "task";
    // if task, update the index
    if (taskMovement) {
      // update database to match current state

      columns.forEach((col) => {
        // get all tasks for the column
        const tasksForColumn = tasks.filter(
          (task) => task.column_id === col.id,
        );
        // for each task, update the index and column_id
        tasksForColumn.forEach(async (task, index) => {
          // TODO: convert this to a hook
          const { data, error } = await supabase
            .from("tasks")
            .update({ index, column_id: task.column_id })
            .eq("id", task.id);

          if (!error) {
            queryClient.invalidateQueries({ queryKey: ["tasksData"] });
          }
        });
      });
    }

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

    setColumns(newColumns.map((col, index) => ({ ...col, index })));

    // Update column indexes in the database
    updateColumnIndexes({ newColumns });
  };

  const createColumnHandler = () => {
    const newColumn: ColumnType = {
      id: generateUUID(),
      title: "New Column",
      index: columns.length,
      board_id: boardData!.id,
      user_id: boardData!.user_id,
      created_at: new Date().toISOString(),
    };

    insertColumn(newColumn);
    setColumns([...columns, newColumn]);
  };

  const renameColumnHandler = (
    columnId: ColumnType["id"],
    newTitle: ColumnType["title"],
  ) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          title: newTitle,
        };
      }
      return col;
    });
    setColumns(updatedColumns);
    updateColumnTitle({ columnId: columnId, newTitle: newTitle });
  };

  const deleteColumnHandler = (id: ColumnType["id"]) => {
    deleteColumn(id);
    const newColumns = columns.filter((col) => col.id !== id);
    setColumns(newColumns);
    updateColumnIndexes({ newColumns });
  };

  const createNewTaskHandler = (
    columnId: ColumnType["id"],
    title: ColumnType["title"],
  ) => {
    const newTask: TaskType = {
      id: generateUUID(),
      index: tasks.length,
      title: title,
      column_id: columnId,
      board_id: boardId,
      user_id: boardData!.user_id!,
      created_at: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    insertTask(newTask);
  };

  const renameTaskHandler = (
    taskId: TaskType["id"],
    newTitle: TaskType["title"],
  ) => {
    updateTaskTitle({ taskId, newTitle });
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task,
      ),
    );
  };

  const deleteTaskHandler = (taskToDelete: TaskType) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
    deleteTask(taskToDelete.id);
    reindexTasksByColumn({ newTasks: tasks, columnId: taskToDelete.column_id });
  };

  return (
    <div className="flex min-h-full w-full overflow-x-auto overflow-y-hidden p-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCorners}
      >
        <div className="flex gap-4">
          <SortableContext items={columnIndexes}>
            {columnsLoading && <div>Loading column...</div>}
            {columns.map((c) => (
              <ColumnContainer
                column={c}
                key={c.id}
                tasks={tasks.filter((t) => t.column_id === c.id)}
                renameColumn={renameColumnHandler}
                deleteColumn={deleteColumnHandler}
                createNewTask={createNewTaskHandler}
                renameTask={renameTaskHandler}
                deleteTask={deleteTaskHandler}
              />
            ))}
          </SortableContext>
          <AddColumnButton onClick={createColumnHandler} />
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
                  renameColumn={renameColumnHandler}
                  deleteColumn={deleteColumnHandler}
                  createNewTask={createNewTaskHandler}
                  renameTask={renameTaskHandler}
                  deleteTask={deleteTaskHandler}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTaskHandler}
                  renameTask={renameTaskHandler}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
}
