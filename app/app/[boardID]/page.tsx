import { BoardType, TaskType, ColumnType } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import UserBoard from '@/components/UserBoard';
import { redirect } from 'next/navigation';

function processBoardData(
	boardData: BoardType,
	columnsData: ColumnType[],
	tasksData: TaskType[]
) {
	const newBoard = {
		title: boardData.title,
		id: boardData.id,
	};

	const newColumns = columnsData.map(column => ({
		id: column.id,
		title: column.title,
		board_id: column.board_id,
	}));

	const newTasks = tasksData.map(task => ({
		title: task.title,
		id: task.id,
		column_id: task.column_id,
	}));

	return { newBoard, newColumns, newTasks };
}

export default async function BoardPage({
	params: { boardID },
}: {
	params: { boardID: string };
}) {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		console.log('no session');
		redirect('/login');
	}

	// TODO: Move these to api or separate file
	const { data: boardData, error: boardError } = await supabase
		.from('boards')
		.select('*')
		.eq('id', boardID)
		.single();

	const { data: columnsData, error: columnsError } = await supabase
		.from('columns')
		.select('*')
		.eq('board_id', boardID);

	const { data: tasksData, error: tasksError } = await supabase
		.from('tasks')
		.select('*')
		.eq('board_id', boardID);

	// Handle errors first with early returns
	if (boardError || columnsError || tasksError) {
		console.error(boardError || columnsError || tasksError);
		const message =
			boardError?.code === '404'
				? 'Board not found'
				: 'Something went wrong';
		return <h1>{message}</h1>;
	}

	const { newBoard, newColumns, newTasks } = processBoardData(
		boardData,
		columnsData,
		tasksData
	);

	return <UserBoard board={newBoard} columns={newColumns} tasks={newTasks} />;
}
