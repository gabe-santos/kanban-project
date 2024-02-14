import { useToast } from "@/components/ui/use-toast";
import { updateColumnIndexes } from "@/queries/columns";
import { TypedSupabaseClient, ColumnType } from "@/utils/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useUpdateColumnIndexesMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ newColumns }: { newColumns: ColumnType[] }) => {
      return updateColumnIndexes(client, newColumns);
    },
    onSuccess: () => {
      toast({ title: "Column indexes updated" });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["columnsData"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating column indexes",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
