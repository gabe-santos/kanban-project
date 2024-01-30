import { TaskType } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: TaskType;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

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
      <Card
        ref={setNodeRef}
        style={style}
        className="relative z-20 flex h-[100px] cursor-grabbing flex-col justify-center rounded-md border-2 border-zinc-700 bg-transparent shadow-none"
      ></Card>
    );
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex h-[100px] cursor-grab flex-col justify-center rounded-md border-2 border-black bg-[#bc95d4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <CardContent>{task.title}</CardContent>
    </Card>
  );
}
