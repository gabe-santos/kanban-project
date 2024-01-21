import { BoardType } from '@/lib/types';
import Link from 'next/link';

export default function BoardsList({ boards }: { boards: BoardType[] }) {
	console.log('BoardsList**', boards);
	return (
		<div className='flex flex-col gap-4 text-2xl'>
			{boards.map(b => (
				<li key={b.id} className='list-none'>
					<Link href={`/${b.id}`} className='hover:underline'>
						{b.title}
					</Link>
				</li>
			))}
		</div>
	);
}
