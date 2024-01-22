import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect, useRouter } from 'next/navigation';
import Login from '../login';

export default async function LoginPage() {
	// const router = useRouter();
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect('/app');
	}

	const handleSignIn = async () => {
		const res = await supabase.auth.signInWithPassword({
			email: 'gabe.santos.codes@gmail.com',
			password: 'password',
		});

		if (res.error) {
			console.log('Error signing in', res.error.message);
		} else {
			console.log('Success signing in');
		}

		redirect('/app');
	};

	return (
		<div>
			<Login user={user} />
		</div>
	);
}
