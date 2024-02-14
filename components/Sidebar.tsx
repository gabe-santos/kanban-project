"use client";
import { useEffect, useRef, useState } from "react";
import NewBoardDialogForm from "./NewBoardDialogForm";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const toggleSidebar = async () => {
    setIsOpen(!isOpen);
  };

  const classes = isOpen
    ? "translate-x-0 ease-out"
    : "translate-x-[-100%] ease-in fixed";

  return (
    <div
      className={`absolute top-24 z-10 flex h-[calc(100vh-96px)] w-[300px] flex-col items-baseline justify-between gap-7  border-r border-black px-8 py-4 transition-all duration-300 ${classes} bg-white `}
      ref={sidebarRef}
    >
      <div className="flex w-full flex-1 flex-col gap-7">
        {children}
        <NewBoardDialogForm buttonVariant="neobrutalism" buttonClasses="" />
      </div>

      <button
        className="absolute -right-12 bottom-20 flex h-12 w-12 items-center justify-center rounded-r-md border border-black bg-[#bc95d4] text-xl font-bold transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        onClick={toggleSidebar}
      >
        {isOpen ? <ArrowLeft /> : <ArrowRight />}
      </button>
    </div>
  );
}
