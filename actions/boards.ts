"use server";

import { NewBoardFormValues } from "@/components/NewBoardDialogForm";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function handleNewBoardFormSubmit({ name }: NewBoardFormValues) {
  const title = name.trim();
  const supabase = createServerActionClient({ cookies });
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;

  if (!user) {
    console.log("No user found");
  } else {
    const { data, error } = await supabase
      .from("boards")
      .insert({ title, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.log("Error creating new board:", error);
      return;
    } else {
      console.log("New board created:", title);
      revalidatePath("/", "layout");

      return data.id;
    }
  }
}
