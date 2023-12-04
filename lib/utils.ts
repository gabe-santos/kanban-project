import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ShortUniqueId from 'short-unique-id';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function randomUUID() {
	const uid = new ShortUniqueId({ length: 8 });
	return uid.rnd();
}
