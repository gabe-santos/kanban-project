import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Sidebar from '../components/ui/Sidebar';
import { SidebarProvider } from '@/components/context/sidebarContext';
import Header from '@/components/ui/Header';
import { BoardTitleProvider } from '@/components/context/boardTitleContext';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={`${GeistSans.className} h-screen`}>
				<SidebarProvider>
					<BoardTitleProvider>
						<Header />
						<div className='w-full flex'>
							<Sidebar />
							<div className='flex flex-col justify-center items-center flex-1 w-full h-[calc(100vh-96px)]'>
								{children}
							</div>
						</div>
					</BoardTitleProvider>
				</SidebarProvider>
			</body>
		</html>
	);
}
