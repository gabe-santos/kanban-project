import { getBoardById } from "@/queries/boards";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { BoardType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export default function useBoardQuery(boardId: BoardType["id"]) {
  const client = useSupabaseBrowser();
  const queryKey = ["boardData", boardId];

  const queryFn = async () => {
    return getBoardById(client, boardId).then((res) => res.data);
  };

  return useQuery({ queryKey, queryFn });
}
