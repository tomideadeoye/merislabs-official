"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

export interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {}

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogOverlay({ ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogContent({ ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Content {...props} />;
}

function DialogHeader({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

function DialogFooter({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

function DialogTitle({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} />;
}

function DialogDescription({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
