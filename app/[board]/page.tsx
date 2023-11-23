'use client';

import { useBoardTitleContext } from '@/components/context/boardTitleContext';

const BoardPage = ({ params }: { params: { board: string } }) => {
	const { setBoardTitle } = useBoardTitleContext();

	setBoardTitle(params.board);

	return <div>Board ID: {params.board}</div>;
};

export default BoardPage;
