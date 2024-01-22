'use client';
import { useEffect, useRef, useState } from 'react';
import NewBoardDialogForm from './NewBoardDialogForm';

export default function Sidebar({ children }: { children?: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarRef]);

	const toggleSidebar = async () => {
		setIsOpen(!isOpen);
	};

	const classes = isOpen
		? 'translate-x-0 ease-out'
		: 'translate-x-[-100%] ease-in fixed';

	return (
		<div
			className={`w-[300px] h-[calc(100vh-96px)] flex flex-col px-8 items-baseline gap-7 py-4 border-0 border-r-2 border-black justify-between transition-all duration-300 top-24 absolute ${classes} bg-white`}
			ref={sidebarRef}>
			<div className='flex flex-col flex-1 gap-7 z-10 '>
				{children}
				<NewBoardDialogForm />
			</div>

			<button
				className='absolute w-12 h-12 -right-12 bottom-20 bg-[#bc95d4] border-2 border-black rounded-r-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] font-bold text-xl'
				onClick={toggleSidebar}>
				{isOpen ? '<' : '>'}
			</button>
		</div>
	);
}
