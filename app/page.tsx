import { buttonVariants } from '@/components/ui/button';

export default function Home() {
	return (
		<div className='flex flex-col items-center gap-4'>
			This board is empty. Create a new column to get started.
			<button
				className={`${buttonVariants({
					variant: 'default',
				})} max-w-[174px]`}>
				+ Add new column
			</button>
			<div>hello</div>
		</div>
	);
}
