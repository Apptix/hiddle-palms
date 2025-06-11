import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as Tooltip from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `font-montserrat inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: string;
  tooltipDelay?: number;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    tooltip,
    tooltipDelay = 300,
    tooltipSide = "top",
    ...props
  }, ref ) => {
    const Comp = asChild ? Slot : "button";

    const buttonElement = (
      <Comp
        className={cn( buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );

    if ( !tooltip ) {
      return buttonElement;
    }

    return (
      <Tooltip.Provider delayDuration={tooltipDelay}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {buttonElement}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side={tooltipSide}
              className="z-50 overflow-hidden rounded-md bg-gray-700 text-gray-50 opacity-1 px-3 py-1.5 text-xs
              text-primary-foreground animate-in fade-in-0 duration-300
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
              sideOffset={5}
            >
              {tooltip}
              {/* <Tooltip.Arrow className="fill-gray-700" /> */}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };