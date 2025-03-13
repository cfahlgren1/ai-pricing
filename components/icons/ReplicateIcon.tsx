import * as React from "react";
import { cn } from "@/lib/utils";

interface ReplicateIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function ReplicateIcon({ className, ...props }: ReplicateIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <title>Replicate</title>
      <path d="M22 10.552v2.26h-7.932V22H11.54V10.552H22zM22 2v2.264H4.528V22H2V2h20zm0 4.276V8.54H9.296V22H6.768V6.276H22z" />
    </svg>
  );
} 