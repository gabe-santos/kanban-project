import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ShortUniqueId from 'short-unique-id';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function randomUUID() {
	return new ShortUniqueId({ length: 10 });
}
