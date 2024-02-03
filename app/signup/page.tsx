"use client";
import { signup } from "@/actions/auth";
import AuthForm from "@/components/AuthForm";
import BigHero from "@/components/BigHero";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase character")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    const errorMsg = await signup(form.getValues());
    if (errorMsg) {
      toast({
        title: "Oops!",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex bg-black">
      <div className="flex h-screen w-1/2 items-center justify-center rounded-3xl bg-zinc-200">
        <AuthForm
          title="Sign Up"
          form={form}
          useEmail
          usePassword
          handleSubmit={handleSubmit}
        />
      </div>
      <BigHero message="welcome! Let's get to work." className="w-1/2" />
    </div>
  );
}
