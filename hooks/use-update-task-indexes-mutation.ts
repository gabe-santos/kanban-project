import { useToast } from "@/components/ui/use-toast";
import { updateTaskIndexes } from "@/queries/tasks";
import { TypedSupabaseClient, TaskType } from "@/utils/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useUpdateTaskIndexesMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ newTasks }: { newTasks: TaskType[] }) => {
      return updateTaskIndexes(client, newTasks);
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
