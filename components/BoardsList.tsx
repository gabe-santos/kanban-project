import { BoardType } from "@/utils/types";
import Link from "next/link";
import MoreDropdown from "./MoreDropdown";

const dropdownOptions = ["Edit", "Delete"];

export default function BoardsList({ boards }: { boards: BoardType[] }) {
  return (
    <div className="flex w-full flex-col gap-4 text-2xl">
      {boards.map((b) => (
        <li
          key={b.id}
          className="justify-space-between group flex w-full list-none gap-2"
        >
          <Link
            href={`/app/${b.id}`}
            className="text-overflow-ellipsis after:ease-[cubic-bezier(0.65_0.05_0.36_1)] relative flex-1 overflow-hidden whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            {b.title}
          </Link>
          <MoreDropdown options={dropdownOptions} />
        </li>
      ))}
    </div>
  );
}
