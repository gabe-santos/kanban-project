import { cn } from "@/lib/utils";

export default function BigHero({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `text-balance hidden h-screen items-center justify-center rounded-3xl border border-black bg-[#B286FD] px-24 text-9xl font-semibold md:flex`,
        className,
      )}
    >
      <div className="text-pretty flex h-screen w-full items-center justify-center">
        {message}
      </div>
    </div>
  );
}
