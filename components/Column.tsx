import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

export function Column({
	children,
	columnId,
	columnTitle,
	className,
}: {
	children?: React.ReactNode;
	columnId: string;
	columnTitle: string;
	className?: string;
}) {
	const { isOver, setNodeRef } = useDroppable({
		id: columnId,
	});

	const extraClasses = className ? className : '';
	const hover = isOver ? 'bg-slate-200' : '';

	return (
		<div
			ref={setNodeRef}
			className={cn(
				'w-[300px] h-full p-4 flex flex-col justify-start gap-4 items-center rounded-lg',
				extraClasses,
				hover
			)}>
			<h1 className='tracking-[2.4px] font-bold uppercase text-slate-600 hover:border-2 hover:border-black rounded-md'>
				{columnTitle}
			</h1>
			droppable id: {columnId}
			{children}
		</div>
	);
}
