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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import NewColumnDialogForm from './NewColumnDialogForm';
import { useCurrentBoardContext } from './context/CurrentBoardContext';

interface UserBoardProps {
	board: BoardType;
	columns: ColumnType[];
	tasks: TaskType[];
}

export default function UserBoard({ board, columns, tasks }: UserBoardProps) {
	const { setCurrentBoard } = useCurrentBoardContext();
	setCurrentBoard(board);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event: DragStartEvent) => {};
	const handleDragMove = (event: DragMoveEvent) => {};
	const handleDragEnd = (event: DragEndEvent) => {};

	// Handle the case where there are no columns
	if (!columns.length) {
		return (
			<div className='flex flex-col items-center'>
				<h2>This board is empty</h2>
				<NewColumnDialogForm />
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}>
			{columns.map(column => (
				<div key={column.id}>
					<h2>{column.title}</h2>
					{tasks.map((task, index) => (
						<div key={index}>{task.title}</div>
					))}
				</div>
			))}
		</DndContext>
	);
}
