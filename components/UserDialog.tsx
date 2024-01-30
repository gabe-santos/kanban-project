"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface UserDialogProps {
  buttonTitle: string | React.ReactNode;
  dialogTitle: string;
  children?: React.ReactNode;
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "neobrutalism"
    | null
    | undefined;
  buttonClasses?: string;
}

export default function UserDialog({
  buttonTitle,
  dialogTitle,
  children,
  buttonVariant,
  buttonClasses,
}: UserDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={cn(buttonClasses)}>
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[40%] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
