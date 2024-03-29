import { useToast } from "@/components/ui/use-toast";
import { insertTask } from "@/queries/tasks";
import { TypedSupabaseClient, TaskType } from "@/utils/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useInsertTaskMutation(client: TypedSupabaseClient) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTask: TaskType) => {
      return insertTask(client, newTask);
    },
    onSuccess: () => {
      toast({ title: "Task created" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasksData"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
