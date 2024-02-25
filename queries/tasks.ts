import { BoardType, TaskType, TypedSupabaseClient } from "@/utils/types";

export const getTasksByBoardId = async (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  const res = await client
    .from("tasks")
    .select()
    .eq("board_id", boardId)
    .order("index", { ascending: true });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};

export const insertTask = async (
  client: TypedSupabaseClient,
  task: TaskType,
) => {
  const res = await client.from("tasks").insert([task]).select();
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};

export const updateTaskTitle = async (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
  title: TaskType["title"],
) => {
  const res = await client
    .from("tasks")
    .update({ title })
    .eq("id", taskId)
    .select();
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};

export const updateTaskIndex = (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
  index: number,
) => {
  return client.from("tasks").update({ index }).eq("id", taskId).select();
};

export const updateTaskIndexes = async (
  client: TypedSupabaseClient,
  updatedTasks: TaskType[],
) => {
  updatedTasks.forEach(async (task, index) => {
    const { error } = await updateTaskIndex(client, task.id, index);
    if (error) {
      throw new Error(error.message);
    }
  });
};

export const reindexTasksByColumn = async (
  client: TypedSupabaseClient,
  tasks: TaskType[],
  columnId: TaskType["column_id"],
) => {
  const tasksByColumn = tasks.filter((task) => task.column_id === columnId);
  tasksByColumn.forEach(async (task, index) => {
    const { error } = await updateTaskIndex(client, task.id, index);
    if (error) {
      throw new Error(error.message);
    }
  });
};

export const updateTaskColumnId = async (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
  newColumnId: TaskType["column_id"],
) => {
  const res = await client
    .from("tasks")
    .update({ column_id: newColumnId })
    .eq("id", taskId)
    .select();
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};

export const deleteTaskById = async (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
) => {
  const res = await client
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .select()
    .single();
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};
