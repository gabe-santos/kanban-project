'use client';

import { useBoardTitleContext } from '@/components/context/boardTitleContext';
import { Column } from '@/components/ui/Column';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import { Board } from '@/lib/types';

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

type Column = {
	id: string;
	title: string;
	taskIds: string[];
};

type Task = {
	title: string;
	description: string;
	id: string;
	columnId: string;
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

const BoardPage = ({ params }: { params: { board: string } }) => {
	const { setBoardTitle } = useBoardTitleContext();
	const [tasks, setTasks] = useState(testTasks);
	const [columns, setColumns] = useState(testColumns);

	const [isDropped, setIsDropped] = useState(false);

	function handleDragEnd(event) {
		if (event.over && event.over.id === 'droppable') {
			setIsDropped(true);
		}
	}

	const filteredTasks = (taskList: Task[], c: Column) => {
		return taskList.filter(t => t.columnId === c.id);
	};

	// console.log(filteredTasks(tasks, columns[0]));

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className='p-8 w-full h-full flex gap-6 overflow-scroll bg-slate-100'>
				{columns.map(c => {
					return (
						<Column
							key={c.id}
							columnId={c.id}
							columnTitle={c.title}>
							{filteredTasks(tasks, c).map(t => {
								return <TaskCard key={t.id} task={t} />;
							})}
						</Column>
					);
				})}
			</div>
		</DndContext>
	);
};

const AddColumnPrompt = () => {
	return (
		<div className='flex flex-col items-center gap-4'>
			This board is empty. Create a new column to get started.
			<button className={`default max-w-[174px]`}>
				+ Add new column
			</button>
		</div>
	);
};

function TaskCard({ task }: { task: Task }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: task.id,
		});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(4deg)`,
		  }
		: undefined;
	const shadow = isDragging ? 'shadow-xl scale-125' : 'shadow-md';
	const rotate = isDragging ? 'rotate-12 transform' : '';

	return (
		<Card
			style={style}
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={cn(
				'w-full border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg'
			)}>
			<CardHeader>{task.title}</CardHeader>
			<CardDescription>
				of {task.subtasks.length} subtasks
			</CardDescription>
		</Card>
	);
}

export default BoardPage;
