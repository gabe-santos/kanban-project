import BoardCard from "@/components/BoardCard";
import NewBoardDialogForm from "@/components/NewBoardDialogForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
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
    <div className="flex justify-center">
      <div className="">
        <h1 className="px-10 pt-10 text-2xl">Boards</h1>
        <div className="grid h-full grid-cols-3 content-start gap-4 p-10">
          {boardData.map((b) => {
            return <BoardCard key={b.id} boardID={b.id} boardName={b.title} />;
          })}
          <NewBoardDialogForm
            buttonVariant="outline"
            buttonClasses="h-[200px] cursor-pointer rounded-md border-2 border-dashed border-black px-10 py-3 text-2xl"
          />
        </div>
      </div>
    </div>
  );
}
