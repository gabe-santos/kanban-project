'use client';

import ConvexClientProvider from './ConvexClientProvider';
import { BoardTitleProvider } from './boardTitleContext';
import { SidebarProvider } from './sidebarContext';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ConvexClientProvider>
			<SidebarProvider>
				<BoardTitleProvider>{children}</BoardTitleProvider>
			</SidebarProvider>
		</ConvexClientProvider>
	);
}
