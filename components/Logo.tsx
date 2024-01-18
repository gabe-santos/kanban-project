import Image from 'next/image';
import logoLight from '../../public/assets/logo-mobile.svg';

export default function Logo({ className }: { className?: string }) {
	const classes = className ? className : '';

	return (
		<Image
			src={logoLight}
			alt='logo'
			className={`${classes} flex-shrink-0`}
		/>
	);
}
