import { toast } from "@/components/ui/use-toast";
import { deleteTaskById } from "@/queries/tasks";
import { TypedSupabaseClient, TaskType } from "@/utils/types";
import { QueryClient, useMutation } from "@tanstack/react-query";

export default function useDeleteTaskMutation(client: TypedSupabaseClient) {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (taskId: TaskType["id"]) => {
      return await deleteTaskById(client, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasksData"] });
      toast({ title: "Task deleted" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
