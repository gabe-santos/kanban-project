import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function MoreDropdown({ options }: { options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100">
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option, index) => {
          return (
            <DropdownMenuItem key={index} className="cursor-pointer">
              {option}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
