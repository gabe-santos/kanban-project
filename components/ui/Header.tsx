'use client';
import { useBoardTitleContext } from '../context/boardTitleContext';
import { useSidebarContext } from '../context/sidebarContext';
import Logo from './Logo';
import { buttonVariants } from './button';

export default function Header() {
	const { toggleSidebar } = useSidebarContext();
	const { boardTitle } = useBoardTitleContext();
	return (
		<div className='flex'>
			<div
				className='text-[48px] w-[300px] flex items-center justify-center gap-2 font-bold hover:cursor-pointer border-0 border-r border-b'
				onClick={toggleSidebar}>
				<Logo className='h-9 w-9' />
				kanban
			</div>
			<div className='w-full h-24 border-0 border-b flex-1 flex items-center px-6 py-8 justify-between'>
				<span className='text-2xl font-semibold'>
					Board ID: {boardTitle}
				</span>
				<button className={buttonVariants({ variant: 'default' })}>
					+ Add New Task
				</button>
			</div>
		</div>
	);
}
