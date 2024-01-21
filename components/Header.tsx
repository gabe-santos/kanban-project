import Login from '@/app/login';
import { useBoardsContext } from './context/boards';
import { useSidebarContext } from './context/sidebarContext';
import Logo from './Logo';
import { Button } from './ui/button';

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<div className='flex'>
			<div className='w-[300px] h-24 gap-2 hover:cursor-pointer border-r-2 border-b-2 border-black font-[1000]'>
				<span className='text-7xl h-full w-full overflow-hidden text-center flex items-center justify-center'>
					kanvas
				</span>
			</div>
			<div className='w-full h-24 border-b-2 border-black flex-1 flex items-center px-6 py-8 justify-between'>
				<Button variant='neobrutalism'>+ New Task</Button>
				{children}
			</div>
		</div>
	);
}
