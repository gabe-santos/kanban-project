import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ShortUniqueId from 'short-unique-id';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateUUID() {
	const uid = new ShortUniqueId({ length: 32 });
	return uid.rnd();
}
