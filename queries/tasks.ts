import { BoardType, TaskType, TypedSupabaseClient } from "@/utils/types";

export const getTasksByBoardId = async (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  const res = await client.from("tasks").select().eq("board_id", boardId);
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
