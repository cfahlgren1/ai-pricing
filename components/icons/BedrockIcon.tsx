import * as React from "react";
import { cn } from "@/lib/utils";

interface BedrockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function BedrockIcon({ className, ...props }: BedrockIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <title>Amazon Bedrock</title>
      <path d="M12 1.406l9.985 5.704v9.78L12 22.594 2.015 16.89V7.11L12 1.406zm0 1.687L3.702 8.11v7.78L12 20.906l8.298-5.016V8.11L12 3.093zm0 3.375l5.532 3.344v6.375L12 19.531l-5.532-3.344V9.812L12 6.468zm0 1.687l-3.845 2.344v4.594L12 17.437l3.845-2.344v-4.594L12 8.155z" />
    </svg>
  );
} 
