import { TypedSupabaseClient, BoardType } from "@/utils/types";

export const getBoardById = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client.from("boards").select("*").eq("id", boardId).single();
};

export const getAllBoards = (client: TypedSupabaseClient) => {
  return client.from("boards").select("*");
};
