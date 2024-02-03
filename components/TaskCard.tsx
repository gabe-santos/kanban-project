"use client";
import { TaskType } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";

interface TaskCardProps {
  task: TaskType;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [editMode, setEditMode] = useState(true);
  const [color, setColor] = useState("#bc95d4");

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

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`flex h-[200px] cursor-grab flex-col justify-between border border-black bg-[${color}] shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <CardContent className="p-4 text-2xl">{task.title}</CardContent>
      <Button
        onClick={() => changeColor()}
        className="opacity-0 hover:opacity-100"
      >
        change color
      </Button>
    </Card>
  );
}
