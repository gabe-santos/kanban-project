import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BoardType, TaskType, ColumnType } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import UserBoard from '@/components/UserBoard';
import { redirect } from 'next/navigation';
import NewColumnDialogForm from '@/components/NewColumnDialogForm';

const testColumns = [
	{
		id: 'column-1',
		title: 'To do',
		taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
	},
	{
		id: 'column-2',
		title: 'In progress',
		taskIds: [],
	},
	{
		id: 'column-3',
		title: 'Done',
		taskIds: [],
	},
];

type Task = {
	title: string;
	description: string;
	id: string;
	subtasks: Subtask[];
};

type Subtask = {
	title: string;
	isCompleted: boolean;
};

const testTasks: Task[] = [
	{
		title: 'Build UI for onboarding flow',
		description: '',
		columnId: 'column-1',
		id: 'task-1',
		subtasks: [
			{
				title: 'Sign up page',
				isCompleted: true,
			},
			{
				title: 'Sign in page',
				isCompleted: false,
			},
			{
				title: 'Welcome page',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Build UI for search',
		description: '',
		id: 'task-2',
		columnId: 'column-1',
		subtasks: [
			{
				title: 'Search page',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Build settings UI',
		description: '',
		id: 'task-3',
		columnId: 'column-1',
		subtasks: [
			{
				title: 'Account page',
				isCompleted: false,
			},
			{
				title: 'Billing page',
				isCompleted: false,
			},
		],
	},
	{
		title: 'QA and test all major user journeys',
		description:
			'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
		id: 'task-4',
		columnId: 'column-1',
		subtasks: [
			{
				title: 'Internal testing',
				isCompleted: false,
			},
			{
				title: 'External testing',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Design settings and search pages',
		description: '',
		id: 'task-5',
		columnId: 'column-2',
		subtasks: [
			{
				title: 'Settings - Account page',
				isCompleted: true,
			},
			{
				title: 'Settings - Billing page',
				isCompleted: true,
			},
			{
				title: 'Search page',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Add account management endpoints',
		description: '',
		id: 'task-6',
		columnId: 'column-2',
		subtasks: [
			{
				title: 'Upgrade plan',
				isCompleted: true,
			},
			{
				title: 'Cancel plan',
				isCompleted: true,
			},
			{
				title: 'Update payment method',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Design onboarding flow',
		description: '',
		id: 'task-7',
		columnId: 'column-2',
		subtasks: [
			{
				title: 'Sign up page',
				isCompleted: true,
			},
			{
				title: 'Sign in page',
				isCompleted: false,
			},
			{
				title: 'Welcome page',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Add search enpoints',
		description: '',
		id: 'task-8',
		columnId: 'column-2',
		subtasks: [
			{
				title: 'Add search endpoint',
				isCompleted: true,
			},
			{
				title: 'Define search filters',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Add authentication endpoints',
		description: '',
		id: 'task-9',
		columnId: 'column-2',
		subtasks: [
			{
				title: 'Define user model',
				isCompleted: true,
			},
			{
				title: 'Add auth endpoints',
				isCompleted: false,
			},
		],
	},
	{
		title: 'Research pricing points of various competitors and trial different business models',
		description:
			"We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
		id: 'task-10',
		columnId: 'column-3',
		subtasks: [
			{
				title: 'Research competitor pricing and business models',
				isCompleted: true,
			},
			{
				title: 'Outline a business model that works for our solution',
				isCompleted: false,
			},
			{
				title: 'Talk to potential customers about our proposed solution and ask for fair price expectancy',
				isCompleted: false,
			},
		],
	},
];

function processBoardData(boardData, columnsData, tasksData) {
	const newBoard = {
		title: boardData.title,
		id: boardData.id,
	};

	const newColumns = columnsData.map(column => ({
		id: column.id,
		title: column.title,
		boardID: column.board_id,
	}));

	const newTasks = tasksData.map(task => ({
		title: task.title,
		id: task.id,
		columnID: task.column_id,
	}));

	return { newBoard, newColumns, newTasks };
}

export default async function BoardPage({
	params: { board },
}: {
	params: { board: string };
}) {
	const boardID = board.trim();

	const supabase = createServerComponentClient({ cookies });

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
