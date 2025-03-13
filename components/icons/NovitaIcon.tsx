import * as React from "react";
import { cn } from "@/lib/utils";

interface NovitaIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function NovitaIcon({ className, ...props }: NovitaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <title>Novita AI</title>
      <path clipRule="evenodd" d="M9.167 4.17v5.665L0 19.003h9.167v-5.666l5.666 5.666H24L9.167 4.17z" />
    </svg>
  );
} 