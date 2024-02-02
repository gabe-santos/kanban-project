import Link from "next/link";
import Logo from "./Logo";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex bg-white">
      <div className="h-24 w-[300px] gap-2 border-b border-r border-black font-[1000] hover:cursor-pointer">
        <Link
          className="flex h-full w-full items-center justify-center overflow-hidden text-center text-7xl"
          href="/"
        >
          <Logo />
        </Link>
      </div>
      <div className="flex h-24 w-full flex-1 items-center justify-between border-b border-black">
        {children}
      </div>
    </div>
  );
}
