"use client";
import { TaskType } from "@/utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import { Database } from "@/utils/database.types";
import { deleteTaskById } from "@/queries/tasks";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";

interface TaskCardProps {
  task: TaskType;
  deleteTask: (id: TaskType["id"]) => void;
  renameTask: (id: TaskType["id"], title: TaskType["title"]) => void;
}

export default function TaskCard({
  task,
  renameTask,
  deleteTask,
}: TaskCardProps) {
  const supabase = useSupabaseBrowser();

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [editMode, setEditMode] = useState(false);
  const [color, setColor] = useState("#bc95d4");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
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
        className="relative z-20 flex h-[200px] cursor-grabbing flex-col justify-center border-2 border-black bg-transparent shadow-none"
      ></div>
    );
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const changeColor = () => {
    setColor("#fecb7f");
    console.log("color changed");
  };

  const handleRenameTask = () => {
    console.log("renaming task", task.id, taskTitle);
    renameTask(task.id, taskTitle);
    setEditMode(false);
  };

  const handleDeleteTask = async () => {
    deleteTask(task.id);
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`flex h-[200px] cursor-grab flex-col justify-between border border-black bg-[${color}] shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <CardContent className="p-4 text-2xl" onClick={() => setEditMode(true)}>
        {!editMode && task.title}
        {editMode && (
          <Input
            ref={inputRef}
            value={taskTitle!}
            autoFocus
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              handleRenameTask();
            }}
            onChange={(e) => {
              setTaskTitle(e.target.value);
            }}
            className="rounded-none border-none bg-transparent px-2 py-0 text-xl focus-visible:ring-1 focus-visible:ring-black"
          />
        )}
      </CardContent>
      <Button onClick={changeColor} className="opacity-0 hover:opacity-100">
        change color
      </Button>
      <Button onClick={handleDeleteTask}>Test Delete</Button>
    </Card>
  );
}
