import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function TestComponent() {
	const supabase = createServerComponentClient({ cookies });
	const { data } = await supabase.from('boards').select('*');

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
