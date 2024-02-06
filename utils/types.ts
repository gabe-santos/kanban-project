import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/utils/database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type BoardType = Database["public"]["Tables"]["boards"]["Row"];

export type BoardActions = {
  addBoard: (board: BoardType) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (board: BoardType) => void;
};

export type ColumnType = Database["public"]["Tables"]["columns"]["Row"];

export type ColumnState = {
  columns: ColumnType[];
};

export type ColumnActions = {
  addColumn: (column: ColumnType) => void;
  deleteColumn: (id: string) => void;
  updateColumn: (column: ColumnType) => void;
  setColumns: (columns: ColumnType[]) => void;
};

export type TaskType = Database["public"]["Tables"]["tasks"]["Row"];

export type TaskActions = {
  addTask: (task: TaskType) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: TaskType) => void;
};

export type User = {
  email: string;
  password: string;
};
