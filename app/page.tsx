import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import useSupabaseServer from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <div className="flex h-3/4 w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Logo className="text-9xl font-bold" />
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-4xl">
            <Link className="hover:underline" href="/login">
              Login
            </Link>
            /
            <Link className="hover:underline" href="/signup">
              Signup
            </Link>
          </div>
          <span>OR</span>
          <Button variant={"neobrutalism"}>
            <Link href={"/demo"}>Try the demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
