import { TypedSupabaseClient, BoardType, ColumnType } from "@/utils/types";

export const getColumnsByBoardId = (
  client: TypedSupabaseClient,
  boardId: BoardType["id"],
) => {
  return client
    .from("columns")
    .select()
    .eq("board_id", boardId)
    .order("index", { ascending: true });
};

export const insertColumn = (
  client: TypedSupabaseClient,
  column: ColumnType,
) => {
  return client.from("columns").insert([column]).select();
};

export const updateColumn = (
  client: TypedSupabaseClient,
  updatedColumn: ColumnType,
  id: ColumnType["id"],
) => {
  return client.from("columns").update(updatedColumn).eq("id", id).select();
};

export const updateColumnTitle = async (
  client: TypedSupabaseClient,
  columnId: ColumnType["id"],
  newTitle: ColumnType["title"],
) => {
  const res = await client
    .from("columns")
    .update({ title: newTitle })
    .eq("id", columnId)
    .select();

  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
};

export const updateColumnIndex = (
  client: TypedSupabaseClient,
  columnId: ColumnType["id"],
  index: number,
) => {
  return client.from("columns").update({ index }).eq("id", columnId).select();
};

export const updateColumnIndexes = async (
  client: TypedSupabaseClient,
  updatedColumns: ColumnType[],
) => {
  updatedColumns.forEach(async (column, index) => {
    const { error } = await updateColumnIndex(client, column.id, index);

    if (error) {
      console.log("Error updating column index", error);
      return { error };
    } else {
      console.log("Column index updated successfully");
    }
  });
};

export const deleteColumn = (
  client: TypedSupabaseClient,
  columnId: ColumnType["id"],
) => {
  return client.from("columns").delete().eq("id", columnId).select();
};
