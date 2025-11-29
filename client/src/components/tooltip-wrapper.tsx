import { useState, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  enabled?: boolean;
  delay?: number;
}

export function TooltipWrapper({ 
  children, 
  content,
  enabled = true,
  delay = 300
}: TooltipWrapperProps) {
  const [open, setOpen] = useState(false);

  if (!enabled || !content) {
    return <>{children}</>;
  }

  return (
    <Tooltip 
      open={open} 
      onOpenChange={setOpen}
      delayDuration={delay}
    >
      <TooltipTrigger asChild>
        <span 
          className="cursor-help"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent 
        className="bg-gray-800 text-white border-gray-700 font-typewriter text-sm px-3 py-2 max-w-xs"
        sideOffset={5}
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
