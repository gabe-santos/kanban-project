"use client";

import { AddColumnButton } from "@/components/AddColumnButton";
import ColumnContainer from "@/components/ColumnContainer";
import TaskCard from "@/components/TaskCard";
import { generateUUID } from "@/lib/utils";
import { BoardType, ColumnType, TaskType } from "@/utils/types";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const defaultBoard: BoardType = {
  id: "board1",
  title: "Demo Board",
  user_id: "nobody",
  created_at: new Date().toISOString(),
};

const defaultColumns: ColumnType[] = [
  {
    title: "Todo",
    id: generateUUID(),
    index: 0,
    board_id: defaultBoard.id,
    user_id: defaultBoard.user_id,
    created_at: Date.now().toString(),
  },
  {
    title: "In Progress",
    id: generateUUID(),
    index: 1,
    board_id: defaultBoard.id,
    user_id: defaultBoard.user_id,
    created_at: Date.now().toString(),
  },
  {
    title: "Done",
    id: generateUUID(),
    index: 2,
    board_id: defaultBoard.id,
    user_id: defaultBoard.user_id,
    created_at: Date.now().toString(),
  },
];

const defaultTasks: TaskType[] = [
  {
    title: "Polish C-3PO",
    id: generateUUID(),
    column_id: defaultColumns[0].id,
    index: 0,
    board_id: defaultBoard.id,
    user_id: defaultBoard!.user_id!,
    created_at: new Date().toISOString(),
  },
  {
    title: "Thrift shop with Jawas",
    id: generateUUID(),
    column_id: defaultColumns[0].id,
    index: 1,
    board_id: defaultBoard.id,
    user_id: defaultBoard!.user_id!,
    created_at: new Date().toISOString(),
  },
  {
    title: "Fix Podracer engine",
    id: generateUUID(),
    column_id: defaultColumns[1].id,
    index: 0,
    board_id: defaultBoard.id,
    user_id: defaultBoard!.user_id!,
    created_at: new Date().toISOString(),
  },
  {
    title: "Join the Dark Side",
    id: generateUUID(),
    column_id: defaultColumns[1].id,
    index: 1,
    board_id: defaultBoard.id,
    user_id: defaultBoard!.user_id!,
    created_at: new Date().toISOString(),
  },
  {
    title: "Execute Order 66",
    id: generateUUID(),
    column_id: defaultColumns[2].id,
    index: 0,
    board_id: defaultBoard.id,
    user_id: defaultBoard!.user_id!,
    created_at: new Date().toISOString(),
  },
];

export default function UserBoardDemo() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const columnIndexes = columns.map((col) => col.id);

  useEffect(() => {
    const savedColumns = localStorage.getItem("columns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      setColumns(defaultColumns);
    }

    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(defaultTasks);
    }
  }, []);

  useEffect(() => {
    console.log("setting columns in local storage", columns);
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    console.log("setting tasks in local storage", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
  };

  const createColumnHandler = () => {
    const newColumn: ColumnType = {
      id: generateUUID(),
      title: "New Column",
      index: columns.length,
      board_id: defaultBoard.id,
      user_id: defaultBoard!.user_id!,
      created_at: new Date().toISOString(),
    };

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
  };

  const deleteColumnHandler = (id: ColumnType["id"]) => {
    const newColumns = columns.filter((col) => col.id !== id);
    setColumns(newColumns);
  };

  const createNewTaskHandler = (
    columnId: ColumnType["id"],
    title: ColumnType["title"],
  ) => {
    const newTask: TaskType = {
      id: generateUUID(),
      title: title,
      column_id: columnId,
      index: tasks.filter((t) => t.column_id === columnId).length + 1,
      board_id: defaultBoard.id,
      user_id: defaultBoard!.user_id!,
      created_at: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
  };

  const renameTaskHandler = (
    taskId: TaskType["id"],
    newTitle: TaskType["title"],
  ) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task,
      ),
    );
  };

  const deleteTaskHandler = (taskToDelete: TaskType) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
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
            {columns.map((col) => (
              <ColumnContainer
                column={col}
                key={col.id}
                tasks={tasks.filter((t) => t.column_id == col.id)}
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
