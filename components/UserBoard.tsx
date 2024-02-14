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
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Suspense, useEffect, useState } from "react";
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

  const { mutate: insertColumn } = useInsertColumnMutation(supabase);
  const { mutate: deleteColumn } = useDeleteColumnMutation(supabase);
  const { mutate: updateColumnTitle } = useUpdateColumnTitleMutation(supabase);
  const { mutate: updateColumnIndexes } =
    useUpdateColumnIndexesMutation(supabase);

  const { mutate: insertTask } = useInsertTaskMutation(supabase);
  const { mutate: updateTaskTitle } = useUpdateTaskTitleMutation(supabase);
  const { mutate: deleteTask } = useDeleteTaskMutation(supabase);

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
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

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

    setColumns(newColumns.map((col, index) => ({ ...col, index })));

    // Update column indexes in the database
    await updateColumnIndexes({ newColumns });
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
    setColumns((columns) => [...columns, newColumn]);
  };

  const renameColumnHandler = (
    newTitle: ColumnType["title"],
    columnId: ColumnType["id"],
  ) => {
    setColumns((columns) =>
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col,
      ),
    );
    updateColumnTitle({ newTitle, columnId });
  };

  const deleteColumnHandler = (id: ColumnType["id"]) => {
    deleteColumn(id);
    setColumns((columns) => columns.filter((col) => col.id !== id));
  };

  const createNewTaskHandler = (
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

    insertTask(newTask);
    setTasks((tasks) => [newTask, ...tasks]);
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

  const deleteTaskHandler = (id: TaskType["id"]) => {
    deleteTask(id);
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
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
