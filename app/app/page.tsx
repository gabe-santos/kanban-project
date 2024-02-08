import BoardCard from "@/components/BoardCard";
import NewBoardDialogForm from "@/components/NewBoardDialogForm";
import { getAllBoards } from "@/queries/boards";
import useSupabaseServer from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Boards",
};

export default async function Menu() {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: boardData, error: boardError } = await getAllBoards(supabase);

  if (!boardData || boardError) {
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
