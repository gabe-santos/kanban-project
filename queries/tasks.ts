import { BoardType, TaskType, TypedSupabaseClient } from "@/utils/types";

export const getTasksByBoardId = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client.from("tasks").select().eq("board_id", boardId);
};

export const insertTask = (client: TypedSupabaseClient, task: TaskType) => {
  return client.from("tasks").insert([task]).select();
};

export const updateTaskTitle = (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
  title: TaskType["title"],
) => {
  return client.from("tasks").update({ title }).eq("id", taskId).select();
};

export const deleteTaskById = (
  client: TypedSupabaseClient,
  taskId: TaskType["id"],
) => {
  return client.from("tasks").delete().eq("id", taskId).select().single();
};
