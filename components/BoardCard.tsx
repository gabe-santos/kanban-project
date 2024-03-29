import Link from "next/link";
import { Card, CardHeader } from "./ui/card";

export default function BoardCard({
  boardName,
  boardID,
}: {
  boardName: string;
  boardID: string;
}) {
  return (
    <Link href={`/app/${boardID}`}>
      <Card className="aspect-3/4 h-[200px] cursor-pointer rounded-sm border border-black bg-[#bc95d4] px-10 py-3 shadow-none transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-3xl hover:border-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="flex h-full flex-col justify-center text-xl font-bold">
          {boardName}
        </CardHeader>
      </Card>
    </Link>
  );
}
