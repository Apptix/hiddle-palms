import { cn } from "@/lib/utils";

interface ILoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Loader({ className, ...props }: ILoaderProps ) {
  return (
    <div className={cn( "flex items-center justify-center h-48", className )} {...props}>
      <div className="animate-spin rounded-full border-b-2 border-t-2 border-primary h-8 w-8"></div>
    </div>
  );
}