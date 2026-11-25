import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-key text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-primary text-white hover:bg-primary-hover",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
      outline: "border border-strong bg-transparent hover:bg-white/10",
      secondary: "bg-card text-foreground hover:bg-white/10",
      ghost: "hover:bg-white/10",
      link: "text-foreground underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
