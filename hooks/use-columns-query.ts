import { getColumnsByBoardId } from "@/queries/columns";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { BoardType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export default function useColumnsQuery(boardId: BoardType["id"]) {
  const client = useSupabaseBrowser();
  const queryKey = ["columnsData", boardId];

  const queryFn = async () => {
    return getColumnsByBoardId(client, boardId).then((res) => res.data);
  };

  return useQuery({ queryKey, queryFn });
}
