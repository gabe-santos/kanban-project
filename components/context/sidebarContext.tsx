'use client';

import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext({
	isOpen: true,
	toggleSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};
