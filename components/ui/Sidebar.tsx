'use client';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSidebarContext } from '../context/sidebarContext';
import Link from 'next/link';

const tempData = [
	{
		title: 'Platform Launch',
		id: '1',
	},
	{
		title: 'Marketing Research',
		id: '2',
	},
	{
		title: 'Product Development',
		id: '3',
	},
];

export default function Sidebar() {
	const { isOpen } = useSidebarContext();

	const classes = isOpen
		? 'translate-x-0 ease-out'
		: 'translate-x-[-100%] ease-in fixed';

	return (
		<div
			className={`w-[300px] h-[calc(100vh-96px)] flex flex-col px-8 items-baseline gap-7 py-4 border-0 border-r justify-between transition-all duration-300 top-24 ${classes}`}>
			<div className='flex-1'>
				<span className='uppercase'>All Boards</span>
				{tempData.map(board => (
					<Link
						href={`/${board.id}`}
						className={`${buttonVariants({ variant: 'link' })}`}
						key={board.id}>
						{board.title}
					</Link>
				))}
				<button className={buttonVariants({ variant: 'ghost' })}>
					+ Create New Board
				</button>
			</div>

			<div className='flex flex-col'>
				<Switch />
				{/* <button onClick={toggleSidebar}>Hide Sidebar</button> */}
			</div>
		</div>
	);
}
