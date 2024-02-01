"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Login({ user }: { user: User | null }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: "28gabe@gmail.com",
      password: "C2^Z$5CJeby2",
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "gabe.santos.codes@gmail.com",
      password: "password",
    });

    if (res.error) {
      console.log("Error signing in", res.error.message);
    } else {
      console.log("Success signing in");
    }

    router.refresh();
  };

  const handleSignOut = async () => {
    const res = await supabase.auth.signOut();
    if (res.error) {
      console.log("Error signing out", res.error.message);
    } else {
      console.log("Success signing out");
    }
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex gap-2 p-4">
        <h1>{user.email}</h1>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}
