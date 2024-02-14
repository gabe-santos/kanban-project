import { useToast } from "@/components/ui/use-toast";
import { deleteColumn } from "@/queries/columns";
import { ColumnType, TypedSupabaseClient } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteColumnMutation(client: TypedSupabaseClient) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (columnId: ColumnType["id"]) => {
      return deleteColumn(client, columnId);
    },
    onSuccess: () => {
      toast({ title: "Column deleted" });
      queryClient.invalidateQueries({ queryKey: ["columnsData"] });
    },
  });
}
