'use client';

import { BoardType } from '@/lib/types';
import React, { createContext, useState, useContext } from 'react';

interface CurrentBoardContextType {
	currentBoard: BoardType | undefined;
	setCurrentBoard: React.Dispatch<
		React.SetStateAction<BoardType | undefined>
	>;
}

const CurrentBoardContext = createContext<CurrentBoardContextType>({
	currentBoard: undefined,
	setCurrentBoard: () => {},
});

export const useCurrentBoardContext = () => useContext(CurrentBoardContext);

export const CurrentBoardProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [currentBoard, setCurrentBoard] = useState<BoardType | undefined>();

	return (
		<CurrentBoardContext.Provider value={{ currentBoard, setCurrentBoard }}>
			{children}
		</CurrentBoardContext.Provider>
	);
};
