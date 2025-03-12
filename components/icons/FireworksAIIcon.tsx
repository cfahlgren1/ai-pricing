import * as React from "react";
import { cn } from "@/lib/utils";

interface FireworksAIIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function FireworksAIIcon({
  className,
  ...props
}: FireworksAIIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 183 91"
      className={cn("fill-current", className)}
      {...props}
    >
      <title>Fireworks AI</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112.65 0L91.33 51.09L69.99 0H56.3L79.69 55.85C81.63 60.51 86.18 63.52 91.25 63.52C96.32 63.52 100.86 60.51 102.81 55.87L126.34 0H112.65ZM121.76 77.84L160.76 38.41L155.44 25.86L112.84 69.01C109.28 72.62 108.26 77.94 110.23 82.6C112.19 87.22 116.72 90.21 121.77 90.21L121.79 90.23L182.68 90.08L177.36 77.53L121.77 77.84H121.76ZM21.92 38.38L27.24 25.83L69.84 68.98C73.4 72.58 74.43 77.92 72.45 82.57C70.49 87.2 65.94 90.18 60.91 90.18L0.02 90.04L0 90.06L5.32 77.51L60.91 77.82L21.92 38.38Z"
      />
    </svg>
  );
}
