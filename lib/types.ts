export type BoardType = {
  title: string;
  id: string;
  user_id: string;
};

export type BoardActions = {
  addBoard: (board: BoardType) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (board: BoardType) => void;
};

export type ColumnType = {
  title: string;
  board_id: string;
  id: string;
  position: number;
  user_id: string;
};

export type ColumnState = {
  columns: ColumnType[];
};

export type ColumnActions = {
  addColumn: (column: ColumnType) => void;
  deleteColumn: (id: string) => void;
  updateColumn: (column: ColumnType) => void;
  setColumns: (columns: ColumnType[]) => void;
};

export type TaskType = {
  id: string;
  title: string;
  column_id: string;
  board_id: string;
  user_id: string;
};

export type TaskActions = {
  addTask: (task: TaskType) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: TaskType) => void;
};

export type User = {
  email: string;
  password: string;
};
