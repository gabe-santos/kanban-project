import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="text-wrap flex h-screen w-full flex-col items-center justify-center text-5xl font-[1000] sm:text-9xl lg:text-[192px]">
      SOMETHING
      <br />
      WENT
      <br />
      WRONG 😦
      <Link href="/" className="mt-8">
        <Button variant="neobrutalism" className="rounded-sm border">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
