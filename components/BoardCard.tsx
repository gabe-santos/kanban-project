import Link from 'next/link';
import { Card, CardHeader } from './ui/card';

export default function BoardCard({
	boardName,
	boardID,
}: {
	boardName: string;
	boardID: string;
}) {
	return (
		<Link href={`/app/${boardID}`}>
			<Card className='rounded-md border-2 border-black bg-[#bc95d4] px-10 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none cursor-pointer h-[200px]'>
				<CardHeader className='flex flex-col justify-center font-bold text-xl h-full'>
					{boardName}
				</CardHeader>
			</Card>
		</Link>
	);
}
