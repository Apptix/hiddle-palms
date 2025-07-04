import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

type TToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: TToasterProps ) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as TToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
