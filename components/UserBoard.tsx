'use client';
import { BoardType, ColumnType, TaskType } from '@/lib/types';
import {
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import NewColumnDialogForm from './NewColumnDialogForm';
import { useCurrentBoardContext } from './context/CurrentBoardContext';
import { useMemo } from 'react';
import ColumnContainer from './ColumnContainer';

interface UserBoardProps {
	board: BoardType;
	columns: ColumnType[];
	tasks: TaskType[];
}

export default function UserBoard({ board, columns, tasks }: UserBoardProps) {
	const { setCurrentBoard } = useCurrentBoardContext();
	setCurrentBoard(board);
	const columnPositions = useMemo(
		() => columns.map(col => col.position),
		[columns]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		})
	);

	const onDragStart = (event: DragStartEvent) => {};
	const onDragMove = (event: DragMoveEvent) => {};
	const onDragEnd = (event: DragEndEvent) => {};

	// Handle the case where there are no columns
	if (!columns.length) {
		return (
			<div className='flex flex-col items-center bg-blue-800 w-full h-full'>
				<h2 className='text-xl'>This board is empty</h2>
				<NewColumnDialogForm />
			</div>
		);
	}

	return (
		<div className='bg-green-800 h-full p-10'>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragMove={onDragMove}
				onDragEnd={onDragEnd}>
				<div className='flex gap-4'>
					<SortableContext items={columnPositions}>
						{columns.map(column => (
							<ColumnContainer
								column={column}
								key={column.id}
								tasks={tasks.filter(
									tasks => tasks.column_id === column.id
								)}
							/>
						))}
					</SortableContext>
				</div>
			</DndContext>
		</div>
	);
}
