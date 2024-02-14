import { toast } from "@/components/ui/use-toast";
import { updateTaskTitle } from "@/queries/tasks";
import { TaskType, TypedSupabaseClient } from "@/utils/types";
import { QueryClient, useMutation } from "@tanstack/react-query";

export default function useUpdateTaskTitleMutation(
  client: TypedSupabaseClient,
) {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async ({
      newTitle,
      taskId,
    }: {
      newTitle: TaskType["title"];
      taskId: TaskType["id"];
    }) => {
      return await updateTaskTitle(client, taskId, newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasksData"] });
      toast({ title: "Task updated" });
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
