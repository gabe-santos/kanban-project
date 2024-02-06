import { BoardType, TaskType, ColumnType } from "@/utils/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import UserBoard from "@/components/UserBoard";
import { redirect } from "next/navigation";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import useSupabaseServer from "@/utils/supabase/server";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBoardById } from "@/lib/queries";

// export async function generateMetadata({
//   params: { boardID },
// }: {
//   params: { boardID: string };
// }) {
//   const supabase = createServerComponentClient({ cookies });
//   const { data: board } = await supabase
//     .from("boards")
//     .select("*")
//     .eq("id", boardID)
//     .single();

//   return {
//     title: board.title,
//   };
// }

export default async function BoardPage({
  params: { boardId },
}: {
  params: { boardId: string };
}) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("no session");
    redirect("/login");
  }

  await prefetchQuery(queryClient, getBoardById(supabase, boardId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserBoard boardId={boardId} />
    </HydrationBoundary>
  );
}
