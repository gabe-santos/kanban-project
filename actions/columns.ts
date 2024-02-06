"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { supabaseActionsClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ColumnType } from "@/utils/types";

export async function deleteColumnHandler(id: string) {
  const cookieStore = cookies();
  const supabase = supabaseActionsClient(cookieStore);

  const { data, error } = await supabase
    .from("columns")
    .delete()
    .eq("id", id)
    .select();

  console.log("deleteColumnHandler", id);
  // const { id } = req.body;

  // try {
  //   const { data, error } = await supabase
  //     .from("columns")
  //     .delete()
  //     .eq("id", id)
  //     .select();

  //   if (error) {
  //     throw new Error("Error deleting column");
  //   }

  //   const updatedColumns: ColumnType[] = columns.filter((col) => col.id !== id);

  //   res
  //     .status(200)
  //     .json({ message: "Column deleted", columns: updatedColumns });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
  // return { message: "Column deleted", columns: [] };
  revalidatePath("/app/app/[boardID]", "page");
}

export async function createColumnHandler(column: ColumnType) {
  const cookieStore = cookies();
  const supabase = supabaseActionsClient(cookieStore);

  const { data, error } = await supabase
    .from("columns")
    .insert(column)
    .select();

  console.log("createColumnHandler", column);

  revalidatePath("/app/app/[boardID]", "page");
}
