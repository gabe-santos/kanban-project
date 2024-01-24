import CurrentBoardName from "@/components/CurrentBoardName";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Login from "../login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Sidebar from "@/components/Sidebar";
import { CurrentBoardProvider } from "@/components/context/CurrentBoardContext";
import BoardsList from "@/components/BoardsList";
import { Suspense } from "react";
import { BoardType } from "@/lib/types";

const defaultBoards: BoardType[] = [
  {
    title: "Default Board",
    id: "54321",
  },
];

export default async function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: boardData, error } = await supabase.from("boards").select();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const boards: BoardType[] =
    boardData?.map((board) => ({
      id: board.id,
      title: board.title,
    })) || defaultBoards;

  return (
    <div className="h-screen">
      <CurrentBoardProvider>
        <Header>
          <CurrentBoardName />
          <div className="flex-1 flex justify-around">
            <Login user={user} />
          </div>
        </Header>
        <div className="w-full flex">
          <Sidebar>
            <span className="uppercase text-xl text-zinc-700">Boards</span>
            <Suspense fallback={<div>Loading...</div>}>
              <BoardsList boards={boards} />
            </Suspense>
          </Sidebar>
        </div>
        <div className="h-[calc(100vh-96px)]">{children}</div>
      </CurrentBoardProvider>
    </div>
  );
}
