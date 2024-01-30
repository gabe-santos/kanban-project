import { ColumnType, TaskType } from "@/lib/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

interface ColumnContainerProps {
  column: ColumnType;
  tasks: TaskType[];
}

export default function ColumnContainer({
  column,
  tasks,
}: ColumnContainerProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task: TaskType) => task.id);
  }, [tasks]);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[800px] max-h-[800px] w-[350px] flex-col rounded-md border-2 border-black"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[800px] max-h-[800px] w-[350px] flex-col rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* TITLE */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          toggleEditMode();
        }}
        className="h-12 rounded-t-md bg-white p-3"
      >
        {!editMode && column.title}
        {editMode && (
          <Input
            value={column.title}
            autoFocus
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-grow flex-col gap-4 p-3">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return <TaskCard key={task.id} task={task} />;
          })}
        </SortableContext>
      </div>
    </div>
  );
}
