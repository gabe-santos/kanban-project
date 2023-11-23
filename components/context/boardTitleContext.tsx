'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BoardTitleContextType {
	boardTitle: string;
	setBoardTitle: (title: string) => void;
}

const defaultState = {
	boardTitle: '',
	setBoardTitle: () => {},
};

const BoardTitleContext = createContext<BoardTitleContextType>(defaultState);

export const useBoardTitleContext = () => useContext(BoardTitleContext);

interface BoardTitleProviderProps {
	children: ReactNode;
}

export const BoardTitleProvider = ({ children }: BoardTitleProviderProps) => {
	const [boardTitle, setBoardTitle] = useState<string>('Default Title');

	return (
		<BoardTitleContext.Provider value={{ boardTitle, setBoardTitle }}>
			{children}
		</BoardTitleContext.Provider>
	);
};
