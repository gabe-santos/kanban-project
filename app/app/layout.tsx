import CurrentBoardName from "@/components/CurrentBoardName";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Login from "../login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Sidebar from "@/components/Sidebar";
import { CurrentBoardProvider } from "@/context/CurrentBoardContext";
import BoardsList from "@/components/BoardsList";
import { Suspense } from "react";
import { BoardType } from "@/utils/types";
import { redirect } from "next/navigation";

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

  if (!user) {
    redirect("/");
  }

  const boards: BoardType[] = boardData?.map((board) => ({
    id: board.id,
    title: board.title,
    created_at: board.created_at,
    user_id: board.user_id,
  }));

  return (
    <div className="h-screen">
      <CurrentBoardProvider>
        <Header>
          <CurrentBoardName />
          <Login user={user} />
        </Header>
        <div className="flex w-full">
          <Sidebar>
            <span className="text-xl uppercase text-zinc-700">Boards</span>
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
