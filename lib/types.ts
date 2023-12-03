interface Board {
	name: string;
	ownerID: string;
}

interface Column {
	name: string;
	boardID: string;
}

interface Task {
	title: string;
	columnID: string;
	description: string;
	status: string;
}

interface User {
	email: string;
	password: string;
}

export type { Board, Column, Task, User };
