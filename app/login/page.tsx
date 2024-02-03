"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inter } from "next/font/google";
import { login } from "@/actions/auth";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/AuthForm";
import BigHero from "@/components/BigHero";

const interFont = Inter({ subsets: ["latin"] });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    const res = await login(form.getValues());
    if (res) {
      toast({
        title: "Oops!",
        description: res.error.message,
        variant: "destructive",
      });
    }
    form.reset();
  };

  return (
    <div className="flex bg-black">
      <BigHero message="welcome back!" className="w-1/2" />
      <div className="flex h-screen w-1/2 items-center justify-center rounded-3xl bg-zinc-200">
        <AuthForm
          title="Login"
          form={form}
          useEmail
          usePassword
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
