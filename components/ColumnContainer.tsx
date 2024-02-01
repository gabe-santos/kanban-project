import { ColumnType, TaskType } from "@/lib/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";
import { Trash2Icon, X } from "lucide-react";

interface ColumnContainerProps {
  column: ColumnType;
  tasks: TaskType[];
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
}

export default function ColumnContainer({
  column,
  tasks,
  updateColumn,
  deleteColumn,
}: ColumnContainerProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task: TaskType) => task.id);
  }, [tasks]);

  const [columnTitle, setColumnTitle] = useState(column.title);
  const [editMode, setEditMode] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If edit mode is enabled, select the text in the input
    if (editMode && inputRef.current) {
      inputRef.current.select();
    }
  }, [editMode]);

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
      className="flex h-[800px] max-h-[800px] w-[350px] flex-col gap-4 rounded-sm border border-black bg-white px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* TITLE */}
      <div
        {...attributes}
        {...listeners}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        className="flex h-[60px] items-center justify-between gap-2 rounded-t-md border-b-2 border-black text-xl"
      >
        <div
          onClick={() => {
            toggleEditMode();
          }}
          className="w-full"
        >
          {!editMode && column.title}
          {editMode && (
            <Input
              ref={inputRef}
              value={columnTitle}
              autoFocus
              onBlur={toggleEditMode}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                updateColumn(column.id, columnTitle);
                setEditMode(false);
              }}
              onChange={(e) => {
                setColumnTitle(e.target.value);
              }}
            />
          )}
        </div>
        {mouseOver && (
          <Button
            variant="outline"
            onClick={() => {
              deleteColumn(column.id);
            }}
            className="border-0 p-0 hover:bg-transparent"
          >
            <X />
          </Button>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-grow flex-col gap-4">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return <TaskCard key={task.id} task={task} />;
          })}
        </SortableContext>
      </div>
    </div>
  );
}
