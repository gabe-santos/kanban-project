import {
  BoardType,
  ColumnType,
  TaskType,
  TypedSupabaseClient,
} from "@/utils/types";

export const getBoardById = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client.from("boards").select("*").eq("id", boardId).single();
};

export const getColumnsByBoardId = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client.from("columns").select("*").eq("board_id", boardId);
};

export const insertColumn = (
  client: TypedSupabaseClient,
  column: ColumnType,
) => {
  return client.from("columns").insert([column]).select();
};

export const updateColumnTitle = (
  client: TypedSupabaseClient,
  columnId: ColumnType["id"],
  title: ColumnType["title"],
) => {
  return client.from("columns").update({ title }).eq("id", columnId).select();
};

export const deleteColumnById = (
  client: TypedSupabaseClient,
  columnId: ColumnType["id"],
) => {
  return client.from("columns").delete().eq("id", columnId).select();
};

export const getTasksByBoardId = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client.from("tasks").select("*").eq("board_id", boardId);
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
