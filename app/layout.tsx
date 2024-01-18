import { Bricolage_Grotesque } from 'next/font/google';

import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '@/components/Header';

import {
	User,
	createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BoardType } from '@/lib/types';
import Login from './login';
import { redirect } from 'next/navigation';

const bricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

const defaultBoards: BoardType[] = [
	{
		title: 'Default Board',
		id: '54321',
	},
];

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createServerComponentClient({ cookies });
	const { data: boardData } = await supabase.from('boards').select();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: session } = await supabase.auth.getSession();

	const boards = boardData?.map((board: BoardType) => {
		const newBoard = {
			id: board.id,
			title: board.title,
		};
		return newBoard;
	});

	return (
		<html lang='en'>
			<body className={`${bricolageGrotesque.className} h-screen`}>
				<Header>
					<Login user={user} />
				</Header>
				<div className='w-full flex'>
					<Sidebar boards={boards!} />
					<div className='flex flex-col justify-center items-center flex-1 w-full h-[calc(100vh-96px)]'>
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
