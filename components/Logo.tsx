"use client";

import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return <p className={cn("", className)}>kanvas</p>;
}
