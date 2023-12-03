import { GeistSans } from 'geist/font/sans';
import { Hanken_Grotesk } from 'next/font/google';
import { Bricolage_Grotesque } from 'next/font/google';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/ui/Sidebar';
import Header from '@/components/ui/Header';
import Providers from '@/components/context/providers';

const bricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });
const ibmPlexMono = IBM_Plex_Mono({ weight: '400', subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={`${bricolageGrotesque.className} h-screen`}>
				<Providers>
					<Header />
					<div className='w-full flex'>
						<Sidebar />
						<div className='flex flex-col justify-center items-center flex-1 w-full h-[calc(100vh-96px)]'>
							{children}
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
