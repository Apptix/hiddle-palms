
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        astral: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-foreground",
        "astral-success": "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-foreground",
        "astral-error": "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30 text-foreground",
        "astral-warning": "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-foreground",
        "astral-info": "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref ) => (
  <div
    ref={ref}
    role="alert"
    className={cn( alertVariants({ variant }), className )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref ) => (
  <h5
    ref={ref}
    className={cn( "mb-1 font-medium leading-none tracking-tight", className )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref ) => (
  <div
    ref={ref}
    className={cn( "text-sm [&_p]:leading-relaxed", className )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
