'use client';

import { Board, BoardContext } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';

const defaultBoard: Board = {
	id: '1',
	title: 'Hello World',
};

const BoardsContext = createContext<BoardContext>({
	boards: [defaultBoard],
	setBoards: () => {},
	currentBoard: defaultBoard,
	setCurrentBoard: () => {},
	columns: [],
	setColumns: () => {},
});

export const useBoardsContext = () => useContext(BoardsContext);

export const BoardsProvider = ({ children }: { children: React.ReactNode }) => {
	const [boards, setBoards] = useState<Board[]>([defaultBoard]);
	const [currentBoard, setCurrentBoard] = useState<Board>(defaultBoard);
	const [columns, setColumns] = useState([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const init = async () => {
		// const dbID = '656e7b0e5ebbb5dcf212';
		// const boardCollectionID = '656e7b29a89da65ce781';
		// const response = await databases.listDocuments(dbID, boardCollectionID);
		// const newBoards = response.documents.map(board => {
		// 	return {
		// 		id: board.$id,
		// 		title: board.title,
		// 	};
		// });
		// setBoards(newBoards);
		// setCurrentBoard(newBoards[0]);
		// let { data: boards, error } = await supabase.from('boards').select('*');
		// console.log(boards);
	};

	// const getColumns = async boardID => {
	// 	const dbID = '656e7b0e5ebbb5dcf212';
	// 	const columnsCollectionID = '6573ac3dd32360ddfc6e';
	// 	const response = await databases.listDocuments(
	// 		dbID,
	// 		columnsCollectionID,
	// 		[Query.equal('boardID', [boardID])]
	// 	);

	// 	const newColumns = response.documents.map(column => {
	// 		return {
	// 			id: column.$id,
	// 			title: column.title,
	// 			boardID: column.boardID,
	// 		};
	// 	});
	// 	setColumns(newColumns);

	// 	const newTasks = newColumns.map(column => {
	// 		getTasksByColumn(column.id);
	// 	});
	// 	console.log(newTasks);
	// 	setTasks(newTasks);
	// };

	// const getTasksByColumn = async columnID => {
	// 	const dbID = '656e7b0e5ebbb5dcf212';
	// 	const tasksCollectionID = '65739610959ca8055971';
	// 	const response = await databases.listDocuments(
	// 		dbID,
	// 		tasksCollectionID,
	// 		[Query.equal('columnID', [columnID])]
	// 	);

	// 	const newTasks = response.documents.map(task => {
	// 		return {
	// 			id: task.$id,
	// 			title: task.title,
	// 			columnID: task.columnID,
	// 		};
	// 	});

	// 	return newTasks;
	// };

	// useEffect(() => {
	// 	init();
	// }, []);

	// useEffect(() => {
	// 	getColumns(currentBoard.id);
	// }, [currentBoard]);

	return (
		<BoardsContext.Provider
			value={{
				boards,
				setBoards,
				currentBoard,
				setCurrentBoard,
				columns,
				setColumns,
			}}>
			{children}
		</BoardsContext.Provider>
	);
};
