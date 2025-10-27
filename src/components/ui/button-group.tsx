import * as React from "react";

import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex items-center", className)}
    role="group"
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
