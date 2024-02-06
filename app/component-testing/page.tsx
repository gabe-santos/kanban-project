"use client";

import { Button } from "@/components/ui/button";
import { useColumnStore } from "@/lib/store";
import { ColumnType } from "@/utils/types";
import { generateUUID } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export default function ComponentTesting() {
  const columns = useColumnStore((state) => state.columns);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {columns.map((column) => (
        <div key={column.id}>{column.title}</div>
      ))}

      <AddColumnButton board_id="1" user_id="1" />
    </div>
  );
}

const AddColumnButton = ({
  board_id,
  user_id,
}: {
  board_id: string;
  user_id: string;
}) => {
  const addColumn = useColumnStore((state) => state.addColumn);

  const handleAddColumn = () => {
    const newColumn: ColumnType = {
      id: generateUUID(),
      title: "New Column",
      position: 0,
      board_id: board_id,
      user_id: user_id,
    };

    // const res = await supabase.from("columns").insert([newColumn]).select();
    // if (res.error) {
    //   toast({ description: "Error creating column" });
    //   return;
    // }
    addColumn(newColumn);
  };

  return (
    <Button
      variant="outline"
      onClick={handleAddColumn}
      className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer justify-start gap-2 border-2 border-zinc-400 p-4 hover:border-black"
    >
      <PlusIcon />
      Add Column
    </Button>
  );
};
