"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";

interface AuthFormProps {
  className?: string;
  title: string;
  form: any;
  handleSubmit: () => void;
  useEmail?: boolean;
  usePassword?: boolean;
}

export default function AuthForm({
  className,
  title,
  form,
  handleSubmit,
  useEmail,
  usePassword,
}: AuthFormProps) {
  return (
    <Card
      className={cn(
        `flex max-h-96 w-3/4 max-w-lg flex-col gap-8 rounded-sm border border-black px-10 py-8`,
        className,
      )}
    >
      <h1 className="text-4xl">{title}</h1>
      <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(handleSubmit)}
          className="flex h-full flex-col gap-6"
        >
          {useEmail && (
            <FormField
              control={form?.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-md text-black">
                        Email
                      </FormLabel>
                      <FormMessage className="text-sm" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email address"
                        className="rounded-none text-lg"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          )}

          {usePassword && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-md text-black">
                        Password
                      </FormLabel>
                      <FormMessage className="text-sm " />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="rounded-none text-lg"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          )}

          <Button type="submit" className="rounded-sm text-xl">
            Go!
          </Button>
        </form>
      </Form>
    </Card>
  );
}
