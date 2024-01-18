import Login from '@/app/login';
import { useBoardsContext } from './context/boards';
import { useSidebarContext } from './context/sidebarContext';
import Logo from './Logo';
import { buttonVariants } from './ui/button';

export default function Header({ children }: { children?: React.ReactNode }) {
	// const { toggleSidebar } = useSidebarContext();
	// const { currentBoard } = useBoardsContext();

	return (
		<div className='flex'>
			<div className='text-[54px] w-[300px] flex items-center justify-center gap-2 hover:cursor-pointer border-r-2 border-b-2 border-black font-[1000]'>
				{/* <Logo className='h-9 w-9' /> */}
				kanvas
			</div>
			<div className='w-full h-24 border-b-2 border-black flex-1 flex items-center px-6 py-8 justify-between'>
				{/* <span className='text-4xl font-semibold'>
					{currentBoard.title}
				</span> */}
				<button className={buttonVariants({ variant: 'neobrutalism' })}>
					+ Add New Task
				</button>
				{children}
			</div>
		</div>
	);
}
