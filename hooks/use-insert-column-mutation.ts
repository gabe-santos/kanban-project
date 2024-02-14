import { useToast } from "@/components/ui/use-toast";
import { insertColumn } from "@/queries/columns";
import { ColumnType, TypedSupabaseClient } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useInsertColumnMutation(client: TypedSupabaseClient) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (column: ColumnType) => {
      return insertColumn(client, column);
    },
    onSuccess: () => {
      toast({ title: "Column added" });
      queryClient.invalidateQueries({ queryKey: ["columnsData"] });
    },
  });
}
