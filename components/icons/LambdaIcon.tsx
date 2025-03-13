import * as React from "react";
import { cn } from "@/lib/utils";

interface LambdaIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function LambdaIcon({ className, ...props }: LambdaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <title>Lambda Labs</title>
      <path d="M12 2L2 19.919h4.427L12 6.878l5.573 13.041H22L12 2zm0 9.713l-3.335 8.206h6.67L12 11.713z" />
    </svg>
  );
} 