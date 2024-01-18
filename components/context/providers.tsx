'use client';

import { BoardsProvider } from './boards';
import { SidebarProvider } from './sidebarContext';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<BoardsProvider>
			<SidebarProvider>{children}</SidebarProvider>
		</BoardsProvider>
	);
}
