import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import UserBoardDemo from "./UserBoardDemo";

export default function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Header></Header>
      <div className="flex w-full"></div>
      <div className="h-[calc(100vh-96px)]">
        <UserBoardDemo />
      </div>
    </div>
  );
}
