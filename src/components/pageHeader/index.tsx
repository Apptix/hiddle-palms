import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "../ui/button";

const PageHeader = ({
  heading,
  subHeading,
  cta,
  className,
  backOnClick,
  showBackButton = false
}: {
  heading?: ReactNode;
  subHeading?: ReactNode;
  cta?: ReactNode;
  className?: string;
  backOnClick?: () => void;
  showBackButton?: boolean;
}) => {
  return (
    <div className={clsx( "flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6", className )}>
      <div className="flex">
        {showBackButton && <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => {
            if ( backOnClick ){
              backOnClick?.();
              return;
            }
            window.history.back();
          }}
        >
          <ArrowLeft size={18} />
        </Button>}
        <div className="flex flex-col gap-2">
          {heading && <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>}
          {subHeading && <p className="text-muted-foreground">{subHeading}</p>}
        </div>
      </div>
      {cta}
    </div>
  );
};

export default PageHeader;
