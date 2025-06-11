
import { ShieldCheck, ShieldX } from "lucide-react";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DocumentViewer } from "@/components/custom/document-viewer";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";

import { LabeledData } from "@/utils/renderUtils/index";
import { IUser } from "./utils/tableConfiguration";
import { capitalize, formatDateTime, formatSnakeCase } from "@/utils";
import { useLoadAccountQuery } from "@/reduxStore/services/user";

interface IUserDetailsProps {
  user: IUser | null;
  isOpen: boolean;
  refreshTrigger?: boolean;
  onClose: ( refresh?: boolean ) => void;
  refetchAllUsers?: () => void;
}

const UserDetails: React.FC<IUserDetailsProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const {
    data: userDetails,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useLoadAccountQuery(
    { username: user?.UserId ?? "" },
    { skip: !user || !isOpen }
  );

  const [ showDocumentViewer, setShowDocumentViewer ] = useState<{
    isOpen: boolean;
    documentType: string;
    applicationId: string;
  }>({
    isOpen: false,
    documentType: "",
    applicationId: ""
  });

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Data"
          description="No User found"
          variant="emptyData"
          buttonText="Try again"
          onAction={refetch}
          imageClassName="h-96 w-96"
        />
      </div>
    );
  }

  const renderObject = ( obj: Record<string, unknown>, excludeKeys: string[] = []) => {
    if ( !obj ) {
      return null;
    }

    const isValidDateTimeFormat = ( value ) => {
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      return regex.test( value );
    };

    const getValue = ( value: any ) => {
      switch ( true ) {
        case typeof value === "boolean":
          return value ? "Yes" : "No";
        case typeof value === "string":
          return isValidDateTimeFormat( value )
            ? formatDateTime( value ).date
            : value?.includes( "-" )
              ? formatSnakeCase( value )
              : ( capitalize( value ) ?? "-" );
        case Array.isArray( value ):
          return (
            <div className="space-y-1">
              {value.map(( item, idx ) => (
                <span key={idx} >
                  {typeof item === "object"
                    ? <div className="ms-2">
                      {renderObject( item as Record<string, unknown> )}
                    </div>
                    : `${String( item || "-" )}${idx < value.length - 1 ? ", " : ""}`}
                </span>
              ))}
            </div>
          );
        case typeof value === "object" && value !== null && !Array.isArray( value ):
          return <div className="ms-2 space-y-3">{renderObject( value as Record<string, unknown> )}</div>;
        default:
          return "-";
      }
    };

    return Object.entries( obj )
      .sort(([keyA], [keyB]) => keyA.localeCompare( keyB ))
      .filter(([key]) => !excludeKeys.includes( key ))
      .map(([ key, value ]) => {
        return <LabeledData
          key={key}
          label={key.replace( /([A-Z])/g, " $1" ).trim()}
          value={key === "UserSignature" ?
            <img key={key} src={value as string} alt={key} className="h-fit w-full object-contain max-h-[5rem]" />
            : getValue( value )}
        />;
      }
      );
  };

  if ( !user ) {
    return null;
  }

  if ( isLoading || isFetching ) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="flex items-center justify-center h-full">
            <SheetTitle className="hidden"></SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl flex gap-2">
              {userDetails?.UserStatus &&
                  ( userDetails.UserStatus.toLowerCase() === "active" ? <ShieldCheck className="text-green-700" /> : <ShieldX className="text-red-700"/> )
              }
              {[ capitalize( userDetails?.FirstName ), capitalize( userDetails?.LastName ) ].join( " " )}
            </SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
            <div className="flex items-center justify-between">
              <span>{userDetails?.UserId}</span>
              <Badge>
                {capitalize( userDetails?.CurrentRole )}
              </Badge>
            </div>
          </SheetHeader>
          <ScrollArea className='h-[calc(100vh-10rem)]'>
            <div className="space-y-6 py-6">
              {renderObject(
                userDetails,
                [ "UserId", "FirstName", "LastName", "LastModifiedTime", "LastModifiedBy", "UserStatus", "DocumentsUploaded", "CurrentRole" ]
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <DocumentViewer
        documentType={showDocumentViewer.documentType}
        applicationId={showDocumentViewer.applicationId}
        open={showDocumentViewer.isOpen}
        onClose={() => setShowDocumentViewer( prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
export default UserDetails;