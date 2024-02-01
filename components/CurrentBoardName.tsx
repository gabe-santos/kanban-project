"use client";

import { useCurrentBoardContext } from "./context/CurrentBoardContext";

export default function CurrentBoardName() {
  const { currentBoard } = useCurrentBoardContext();

  const currentBoardName = currentBoard ? currentBoard.title : "";

  return (
    <div className="h-full flex-1 overflow-hidden whitespace-nowrap p-4 text-6xl">
      {currentBoardName}
    </div>
  );
}
