type BoardType = {
	title: string;
	id: string;
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
	boardID: string;
	id: string;
};

interface TaskType {
	id: string;
	title: string;
	columnID: string;
}

interface User {
	email: string;
	password: string;
}

export type { BoardType, BoardContext, ColumnType, TaskType, User };
