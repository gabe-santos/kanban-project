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
            className="text-overflow-ellipsis flex-1 overflow-hidden whitespace-nowrap hover:underline"
          >
            {b.title}
          </Link>
          <MoreDropdown options={dropdownOptions} />
        </li>
      ))}
    </div>
  );
}
