import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export const AddColumnButton = ({ onClick }: { onClick: () => void }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer justify-start gap-2 border-2 border-zinc-400 p-4 hover:border-black"
    >
      <PlusIcon />
      Add Column
    </Button>
  );
};
