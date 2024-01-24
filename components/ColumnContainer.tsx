import { ColumnType, TaskType } from '@/lib/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useMemo } from 'react';

interface ColumnContainerProps {
	column: ColumnType;
	tasks: TaskType[];
}

export default function ColumnContainer({
	column,
	tasks,
}: ColumnContainerProps) {
	const tasksIds = useMemo(() => {
		return tasks.map((task: TaskType) => task.id);
	}, [tasks]);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: column.id });
	return (
		<div ref={setNodeRef} className='bg-purple-700 flex flex-col'>
			<div>
				<SortableContext items={tasksIds}>
					{column.title}
					{tasks.map(t => {
						return <div key={t.id}>{t.title}</div>;
					})}
				</SortableContext>
			</div>
		</div>
	);
}
