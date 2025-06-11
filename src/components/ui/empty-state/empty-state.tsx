import "./empty-state.css";

import React from "react";

import { Button } from "../button";
import { cn } from "@/lib/utils";

export interface IEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "emptyData" | "noFile" | "noAccess" | "noConnections";
  title: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
  customImage?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, IEmptyStateProps>(
  ({
    className,
    variant = "emptyData",
    title,
    description,
    buttonText,
    onAction,
    imageClassName,
    children
  }, ref ) => {
    return (
      <div
        ref={ref}
        className={cn( "emptyState", className )}
      >
        <div
          className={cn( "emptyStateImage", variant, imageClassName )}
          role="img"
          aria-label={title}
        />
        <div className="emptyStateContentWrapper">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          {buttonText && onAction && (
            <Button onClick={onAction}>
              {buttonText}
            </Button>
          )}
          {children}
        </div>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };