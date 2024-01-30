import BoardCard from "@/components/BoardCard";
import NewBoardDialogForm from "@/components/NewBoardDialogForm";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Menu() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: boardData, error: boardError } = await supabase
    .from("boards")
    .select("*");

  if (boardError) {
    return <div>Error loading boards</div>;
  }

  return (
    <div>
      <h1 className="px-10 pt-10 text-2xl">Boards</h1>
      <div className="grid h-full grid-cols-3 content-start gap-4 p-10">
        {boardData.map((b) => {
          return <BoardCard key={b.id} boardID={b.id} boardName={b.title} />;
        })}
        <Button
          variant={"outline"}
          className="h-[200px] cursor-pointer rounded-md border-2 border-dashed border-black px-10 py-3"
        >
          <PlusIcon />
          <div className="text-2xl">Create New Board</div>
        </Button>
        <NewBoardDialogForm />
      </div>
    </div>
  );
}
