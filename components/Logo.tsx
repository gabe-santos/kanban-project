import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return <div className={cn(className, "font-[1000]")}>kanvas</div>;
}
