"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseActionsClient } from "@/utils/supabase/actions";
import { LoginValues } from "@/app/login/page";
import { SignupValues } from "@/app/signup/page";

export async function login(formData: LoginValues) {
  const cookieStore = cookies();
  const supabase = supabaseActionsClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: SignupValues) {
  const cookieStore = cookies();
  const supabase = supabaseActionsClient(cookieStore);

  console.log("signing up");

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  redirect("/");
}
