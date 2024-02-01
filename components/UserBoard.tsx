"use client";
import { BoardType, ColumnType, TaskType } from "@/lib/types";
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
import { useCurrentBoardContext } from "./context/CurrentBoardContext";
import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { PlusIcon } from "lucide-react";
import { generateUUID } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "./ui/use-toast";

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
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const { setCurrentBoard } = useCurrentBoardContext();
  setCurrentBoard(boardData);
  const columnIndexes = useMemo(
    () => columnsData.map((col) => col.id),
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
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      // TODO: use this to update position values in db and probably rename to index
      console.log(activeColumnIndex, overColumnIndex);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const createNewColumn = async () => {
    const newColumn: ColumnType = {
      id: generateUUID(),
      title: "New Column",
      position: 0,
      board_id: boardData.id,
      user_id: boardData.user_id,
    };

    const res = await supabase.from("columns").insert([newColumn]).select();
    if (res.error) {
      toast({ description: "Error creating column" });
      return;
    }

    setColumns((columns) => [...columns, newColumn]);
  };

  const updateColumn = async (id: string, title: string) => {
    const { data, error } = await supabase
      .from("columns")
      .update({ title })
      .eq("id", id)
      .select();
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

  const deleteColumn = async (id: string) => {
    const { data, error } = await supabase
      .from("columns")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      toast({ description: "Error deleting column" });
      return;
    } else {
      toast({ description: "Column deleted" });
    }

    const updatedColumns: ColumnType[] = columns.filter((col) => col.id !== id);
    setColumns(updatedColumns);
  };

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
                updateColumn={updateColumn}
                deleteColumn={deleteColumn}
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
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
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

const AddColumnButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer justify-start gap-2 border-2 border-zinc-400 p-4 hover:border-black"
    >
      <PlusIcon />
      Add Column
    </Button>
  );
};
