"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export default async function deleteColumnHandler(id: string) {
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
  return { message: "Column deleted", columns: [] };
}
