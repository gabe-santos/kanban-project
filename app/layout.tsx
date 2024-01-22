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
import BoardsList from '@/components/BoardsList';
import { Button } from '@/components/ui/button';
import CurrentBoardName from '@/components/CurrentBoardName';
import { CurrentBoardProvider } from '@/components/context/CurrentBoardContext';

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
	const { data: boardData, error } = await supabase.from('boards').select();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: session } = await supabase.auth.getSession();

	const boards: BoardType[] =
		boardData?.map(board => ({
			id: board.id,
			title: board.title,
		})) || defaultBoards;
	console.log(boards);

	return (
		<html lang='en'>
			<body className={`${bricolageGrotesque.className} h-screen`}>
				<CurrentBoardProvider>
					<Header>
						<CurrentBoardName />
						<div className='flex-1 flex justify-around'>
							<Button variant='neobrutalism'>+ New Task</Button>
							<Login user={user} />
						</div>
					</Header>
					<div className='w-full flex'>
						<Sidebar>
							<span className='uppercase text-xl text-zinc-700'>
								Boards
							</span>
							<BoardsList boards={boards} />
						</Sidebar>
						{children}
					</div>
				</CurrentBoardProvider>
			</body>
		</html>
	);
}
