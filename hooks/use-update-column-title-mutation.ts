import { useToast } from "@/components/ui/use-toast";
import { updateColumnTitle } from "@/queries/columns";
import { ColumnType, TypedSupabaseClient } from "@/utils/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useUpdateColumnTitleMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      newTitle,
      columnId,
    }: {
      columnId: ColumnType["id"];
      newTitle: ColumnType["title"];
    }) => {
      return updateColumnTitle(client, columnId, newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columnsData"] });
      toast({ title: "Column updated" });
    },
    onError: (error) => {
      toast({
        title: "Error updating column",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
