import { useToast } from "@/components/ui/use-toast";
import { updateTaskColumnId } from "@/queries/tasks";
import { TypedSupabaseClient, TaskType } from "@/utils/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useUpdateTaskColumnIdMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      taskId,
      newColumnId,
    }: {
      taskId: TaskType["id"];
      newColumnId: TaskType["column_id"];
    }) => {
      return updateTaskColumnId(client, taskId, newColumnId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasksData"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
