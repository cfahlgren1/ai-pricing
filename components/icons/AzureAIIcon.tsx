import * as React from "react";
import { cn } from "@/lib/utils";

interface AzureAIIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function AzureAIIcon({ className, ...props }: AzureAIIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <title>AzureAI</title>
      <path clipRule="evenodd" d="M16.233 0c.713 0 1.345.551 1.572 1.329.227.778 1.555 5.59 1.555 5.59v9.562h-4.813L14.645 0h1.588z" fillOpacity=".5" />
      <path d="M23.298 7.47c0-.34-.275-.6-.6-.6h-2.835a3.617 3.617 0 00-3.614 3.615v5.996h3.436a3.617 3.617 0 003.613-3.614V7.47z" />
      <path clipRule="evenodd" d="M16.233 0a.982.982 0 00-.989.989l-.097 18.198A4.814 4.814 0 0110.334 24H1.6a.597.597 0 01-.567-.794l7-19.981A4.819 4.819 0 0112.57 0h3.679-.016z" />
    </svg>
  );
} 