import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface IAstralTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  children: React.ReactNode;
}

export const AstralTabs = React.forwardRef<React.ElementRef<typeof Tabs>, IAstralTabsProps>(
  ({ className, ...props }, ref ) => (
    <Tabs ref={ref} className={cn( "w-full", className )} {...props} />
  )
);

AstralTabs.displayName = "AstralTabs";

export interface IAstralTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  children: React.ReactNode;
}

export const AstralTabsList = React.forwardRef<React.ElementRef<typeof TabsList>, IAstralTabsListProps>(
  ({ className, ...props }, ref ) => (
    <TabsList
      ref={ref}
      className={cn(
        "grid w-full rounded-lg border bg-card p-1",
        className
      )}
      {...props}
    />
  )
);

AstralTabsList.displayName = "AstralTabsList";

export interface IAstralTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  children: React.ReactNode;
}

export const AstralTabsTrigger = React.forwardRef<React.ElementRef<typeof TabsTrigger>, IAstralTabsTriggerProps>(
  ({ className, ...props }, ref ) => (
    <TabsTrigger
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
);

AstralTabsTrigger.displayName = "AstralTabsTrigger";

export interface IAstralTabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsContent> {
  children: React.ReactNode;
}

export const AstralTabsContent = React.forwardRef<React.ElementRef<typeof TabsContent>, IAstralTabsContentProps>(
  ({ className, ...props }, ref ) => (
    <TabsContent
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
);

AstralTabsContent.displayName = "AstralTabsContent";
