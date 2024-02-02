type BoardType = {
  title: string;
  id: string;
  user_id: string;
};

type BoardContext = {
  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;
  currentBoard: BoardType;
  setCurrentBoard: (board: BoardType) => void;
  columns: ColumnType[];
  setColumns: (columns: ColumnType[]) => void;
};

type ColumnType = {
  title: string;
  board_id: string;
  id: string;
  position: number;
  user_id: string;
};

interface TaskType {
  id: string;
  title: string;
  column_id: string;
  board_id: string;
  user_id: string;
}

interface User {
  email: string;
  password: string;
}

export type { BoardType, BoardContext, ColumnType, TaskType, User };
