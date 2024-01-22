import BoardCard from '@/components/BoardCard';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Menu() {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/login');
	}

	const { data: boardData, error: boardError } = await supabase
		.from('boards')
		.select('*');

	if (boardError) {
		return <div>Error loading boards</div>;
	}

	return (
		<div>
			<h1 className='text-2xl pt-10 px-10'>Boards</h1>
			<div className='grid grid-cols-3 content-start p-10 h-full gap-4'>
				{boardData.map(b => {
					return (
						<BoardCard
							key={b.id}
							boardID={b.id}
							boardName={b.title}
						/>
					);
				})}
			</div>
		</div>
	);
}
