import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="h-24 w-[300px] gap-2 border-b-2 border-r-2 border-black font-[1000] hover:cursor-pointer">
        <Link
          className="flex h-full w-full items-center justify-center overflow-hidden text-center text-7xl"
          href="/"
        >
          kanvas
        </Link>
      </div>
      <div className="flex h-24 w-full flex-1 items-center justify-between border-b-2 border-black">
        {children}
      </div>
    </div>
  );
}
