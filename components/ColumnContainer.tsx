import { ColumnType, TaskType } from "@/utils/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface ColumnContainerProps {
  column: ColumnType;
  tasks: TaskType[];
  renameColumn: (id: ColumnType["id"], title: ColumnType["title"]) => void;
  deleteColumn: (id: ColumnType["id"]) => void;
  createNewTask: (
    columnId: ColumnType["id"],
    title: ColumnType["title"],
  ) => void;
  renameTask: (id: TaskType["id"], title: TaskType["title"]) => void;
  deleteTask: (task: TaskType) => void;
}

export default function ColumnContainer({
  column,
  tasks,
  renameColumn,
  createNewTask,
  deleteColumn,
  renameTask,
  deleteTask,
}: ColumnContainerProps) {
  const sortedTasks = useMemo(() => {
    return tasks.sort((a, b) => a.index - b.index);
  }, [tasks]);

  const tasksIds = useMemo(() => {
    return sortedTasks.map((task) => task.id);
  }, [sortedTasks]);
  const [columnTitle, setColumnTitle] = useState<ColumnType["title"]>(
    column.title,
  );
  const [editMode, setEditMode] = useState(false);
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

  const handleRenameColumn = () => {
    renameColumn(column.id, columnTitle);
    setEditMode(false);
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

  const sharedStyles = "h-[800px] max-[800px] w-[350px] rounded-sm";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(`flex flex-col border-2 border-black`, sharedStyles)}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        `flex w-[350px] flex-col justify-between gap-4 border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`,
        sharedStyles,
      )}
    >
      <div className="flex flex-col gap-4 px-6">
        {/* TITLE */}
        <div
          {...attributes}
          {...listeners}
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
                value={columnTitle!}
                autoFocus
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  handleRenameColumn();
                }}
                onChange={(e) => {
                  setColumnTitle(e.target.value);
                }}
                className="rounded-none border-none px-2 py-0 text-xl focus-visible:ring-1"
              />
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              deleteColumn(column.id);
            }}
            type="submit"
            className="border-0 bg-white p-0 opacity-0 transition-opacity duration-0 hover:bg-white hover:opacity-100"
          >
            <X />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-grow flex-col gap-4">
          <SortableContext items={tasksIds}>
            {sortedTasks.map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  renameTask={renameTask}
                />
              );
            })}
          </SortableContext>
        </div>
      </div>
      <Button
        onClick={() => {
          createNewTask(column.id, "New Task");
        }}
        variant="outline"
        className="rounded-b-sm rounded-t-none bg-white text-black opacity-30 transition-opacity duration-0 hover:bg-zinc-200 hover:opacity-100"
      >
        <Plus />
        Add Card
      </Button>
    </div>
  );
}
