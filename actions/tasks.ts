"use server";

import { createClient } from "@/utils/supabase/actions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const deleteTask = async (id: string, boardId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log("deleteTask", id);

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw new Error("Error deleting task");
  } else {
    console.log("Task deleted");
    revalidatePath(`/app/`);

    return { message: "Task deleted" };
  }
};
