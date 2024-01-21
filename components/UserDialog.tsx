'use client';

import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';

interface UserDialogProps {
	buttonTitle: string;
	dialogTitle: string;
	children?: React.ReactNode;
}

export default function UserDialog({
	buttonTitle,
	dialogTitle,
	children,
}: UserDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='neobrutalism'>{buttonTitle}</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black'>
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
