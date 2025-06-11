import { Card } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAstralCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AstralCard = React.forwardRef<HTMLDivElement, IAstralCardProps>(
  ({ className, children, ...props }, ref ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border border-border bg-card shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
AstralCard.displayName = "AstralCard";
