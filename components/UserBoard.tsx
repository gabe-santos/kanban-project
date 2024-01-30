"use client";
import { BoardType, ColumnType, TaskType } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import NewColumnDialogForm from "./NewColumnDialogForm";
import { useCurrentBoardContext } from "./context/CurrentBoardContext";
import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

interface UserBoardProps {
  boardData: BoardType;
  columnsData: ColumnType[];
  tasksData: TaskType[];
}

export default function UserBoard({
  boardData,
  columnsData,
  tasksData,
}: UserBoardProps) {
  const { setCurrentBoard } = useCurrentBoardContext();
  setCurrentBoard(boardData);
  const columnIndexes = useMemo(
    () => columnsData.map((col) => col.position),
    [columnsData],
  );

  const [tasks, setTasks] = useState<TaskType[]>(tasksData);
  const [columns, setColumns] = useState<ColumnType[]>(columnsData);

  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

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

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    console.log(columnIndexes);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveColumn = active.data.current?.type === "column";
    if (!isActiveColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.position === activeId,
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.position === overId,
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  // Handle the case where there are no columns
  if (!columnsData.length) {
    return (
      <div className="flex h-full w-full flex-col items-center bg-blue-800">
        <h2 className="text-xl">This board is empty</h2>
        <NewColumnDialogForm />
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full overflow-x-auto overflow-y-hidden p-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <SortableContext items={columnIndexes}>
            {columns.map((c) => (
              <ColumnContainer
                column={c}
                key={c.id}
                tasks={tasks.filter((tasks) => tasks.column_id === c.id)}
              />
            ))}
          </SortableContext>
          <Button variant="neobrutalism" className="">
            Add Column
          </Button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.column_id === activeColumn.id,
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}
