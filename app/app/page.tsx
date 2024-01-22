import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Menu() {
	const supabase = createServerComponentClient({ cookies });

	const { data: boardData, error: boardError } = await supabase
		.from('boards')
		.select('*');

	if (boardError) {
		return <div>Error loading boards</div>;
	}

	return (
		<div>
			{boardData.map(b => {
				return <div key={b.id}>{b.title}</div>;
			})}
		</div>
	);
}
