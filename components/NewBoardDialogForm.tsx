'use client';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import UserDialog from './UserDialog';
import { Button } from './ui/button';

import { z } from 'zod';
import { Form } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleNewBoardFormSubmit } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const newBoardFormSchema = z.object({
	name: z.string().min(1).max(32),
});

export type NewBoardFormValues = z.infer<typeof newBoardFormSchema>;

export default function NewBoardDialogForm() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { register, handleSubmit, reset } = useForm<
		z.infer<typeof newBoardFormSchema>
	>({
		resolver: zodResolver(newBoardFormSchema),
	});

	const onNewBoardFormSubmit = async (data: NewBoardFormValues) => {
		const boardID = await handleNewBoardFormSubmit(data);
		reset();
		router.push(`/${boardID}`);
	};

	return (
		<UserDialog buttonTitle='+ New Board' dialogTitle='Add New Board'>
			<form
				onSubmit={handleSubmit(data => onNewBoardFormSubmit(data))}
				className='grid gap-4 py-4'>
				<div className='flex flex-col justify-baseline gap-4'>
					<Label htmlFor='board-title' className='text-left'>
						Board Name
					</Label>
					<Input
						id='board-title'
						placeholder='e.g. Marketing Campaign'
						className='w-full'
						{...register('name')}
						data-1p-ignore
						required
					/>
				</div>
				<Button type='submit' variant='neobrutalism'>
					Create
				</Button>
			</form>
		</UserDialog>
	);
}
