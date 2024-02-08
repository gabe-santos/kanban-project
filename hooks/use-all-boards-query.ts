import { getAllBoards } from "@/queries/boards";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useAllBoardsQuery() {
  const client = useSupabaseBrowser();
  const queryKey = ["allBoardsData"];

  const queryFn = async () => {
    return getAllBoards(client).then((res) => res.data);
  };

  return useQuery({ queryKey, queryFn });
}
