import Link from 'next/link';

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<div className='flex'>
			<div className='w-[300px] h-24 gap-2 hover:cursor-pointer border-r-2 border-b-2 border-black font-[1000]'>
				<Link
					className='text-7xl h-full w-full overflow-hidden text-center flex items-center justify-center'
					href='/'>
					kanvas
				</Link>
			</div>
			<div className='w-full h-24 border-b-2 border-black flex-1 flex items-center justify-between'>
				{children}
			</div>
		</div>
	);
}
