import { toast } from "@/components/ui/use-toast";
import { reindexTasksByColumn, updateTaskIndexes } from "@/queries/tasks";
import { TaskType, TypedSupabaseClient } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useReindexTasksByColumnMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      newTasks,
      columnId,
    }: {
      newTasks: TaskType[];
      columnId: TaskType["column_id"];
    }) => {
      return reindexTasksByColumn(client, newTasks, columnId);
    },
    onSuccess: () => {
      toast({ title: "Task indexes updated" });
      console.log("Task indexes updated");
    },
    onSettled: async () => {
      console.log("Task indexes updated");
      toast({ title: "Task indexes updated" });
      return await queryClient.invalidateQueries({ queryKey: ["tasksData"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating task indexes",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
