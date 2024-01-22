'use client';

import { Suspense } from 'react';
import { useCurrentBoardContext } from './context/CurrentBoardContext';

export default function CurrentBoardName() {
	const { currentBoard } = useCurrentBoardContext();

	const currentBoardName = currentBoard ? currentBoard.title : '';

	return (
		<div className='text-6xl border-black h-full border-r-2 p-4 flex-1 whitespace-nowrap overflow-hidden'>
			<Suspense fallback={<div>Loading...</div>}>
				{currentBoardName}
			</Suspense>
		</div>
	);
}
