import { getTasksByBoardId } from "@/queries/tasks";
import { useSupabaseBrowser } from "@/utils/supabase/client";
import { BoardType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export default function useTasksQuery(boardId: BoardType["id"]) {
  const client = useSupabaseBrowser();
  const queryKey = ["tasksData", boardId];

  const queryFn = async () => {
    return getTasksByBoardId(client, boardId).then((res) => res.data);
  };

  return useQuery({ queryKey, queryFn });
}
