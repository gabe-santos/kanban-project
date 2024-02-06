import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../database.types";
import { TypedSupabaseClient } from "../types";
import { useMemo } from "react";

let client: TypedSupabaseClient;

function getSupabaseBrowserClient() {
  if (client) return client;

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
}

export function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}
