import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Check, ClipboardList, Clock, Eye, FileText, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
// First, import formatSnakeCase
import { capitalize, formatDateTime, formatSnakeCase, unCamelize } from "@/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "@/components/custom/document-viewer";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import UnderReviewModal from "./components/UnderReviewModal";

import { LabeledData } from "@/utils/renderUtils/index";
import { statusColors } from "@/constants";
import { useGetApplicationByIdQuery } from "@/reduxStore/services/applications";
import { IApplication } from "./utils/tableConfiguration";
import { useUserPermission } from "@/hooks/useUserPermissions";

interface IApplicationDetailsProps {
  application: IApplication | null;
  isOpen: boolean;
  refreshTrigger?: boolean;
  onClose: ( refresh?: boolean ) => void;
  handleApprove: ( app: IApplication ) => void;
  handleDeny: ( app: IApplication ) => void;
  refetchAllApplications?: () => void;
}

const ApplicationDetails: React.FC<IApplicationDetailsProps> = ({
  application,
  isOpen,
  refreshTrigger,
  onClose,
  handleApprove,
  handleDeny,
  refetchAllApplications
}) => {
  const {
    data: applicationDetails,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetApplicationByIdQuery(
    { applicationId: application?.ApplicationId },
    { skip: !application?.ApplicationId }
  );

  const [ isReviewOpen, setIsReviewOpen ] = useState( false );
  const permissions = useUserPermission( "applications" );
  const [ showDocumentViewer, setShowDocumentViewer ] = useState<{
    isOpen: boolean;
    documentType: string;
    applicationId: string;
  }>({
    isOpen: false,
    documentType: "",
    applicationId: ""
  });
  const canMarkAsReview = permissions?.includes( "review" );
  const canApprove = permissions?.includes( "approve" );
  const canReject = permissions?.includes( "reject" );
  const details = applicationDetails;

  useEffect(() => {
    if ( isOpen && application ) {
      refetch();
    }
  }, [ refreshTrigger, isOpen, application, refetch ]);

  const handleMarkAsReview = () => {
    setIsReviewOpen( true );
  };

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Data"
          description="No applications found"
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
              : ( value ?? "-" );
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
      .map(([ key, value ]) => (
        <LabeledData
          key={key}
          label={key.replace( /([A-Z])/g, " $1" ).trim()}
          value={getValue( value )}
        />
      ));
  };

  if ( !application ) {
    return null;
  }

  if ( isLoading || isFetching ) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="flex items-center justify-center h-full">
            <SheetTitle className="hidden" ></SheetTitle >
            <SheetDescription className="hidden" ></SheetDescription>
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
            <SheetTitle className="text-xl">Application Details</SheetTitle>
            <SheetDescription className="hidden" ></SheetDescription>
            <div className="flex items-center justify-between">
              <span>#{details.ApplicationId}</span>
              <Badge className={statusColors[details.ApplicationStatus]}>
                {capitalize( details.ApplicationStatus )}
              </Badge>
            </div>
          </SheetHeader>
          <ScrollArea className='h-[calc(100vh-10rem)]'>
            <div className="space-y-6 py-6">
              <Accordion
                type="multiple"
                defaultValue={[ "overview", "details", "wholesaler", "documents", "rejection", "signatures", "timeline" ]}
                className="w-full"
              >
                <AccordionItem value="overview" className="border-b">
                  <AccordionTrigger className="py-4 text-base font-medium">
                    Basic Information
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <LabeledData
                        label="Application Type"
                        value={capitalize( details.ApplicationType )}
                      />
                      <LabeledData
                        label="County"
                        value={capitalize( details.County )}
                      />
                      <LabeledData
                        label="Applicant Name"
                        value={details.ApplicantName}
                      />
                      <LabeledData
                        label="Applicant ID"
                        value={details.ApplicantUserId}
                      />
                      <LabeledData
                        label="Applicant Age"
                        value={details.ApplicantAge}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {details.ApplicationDetails && (
                  <AccordionItem value="details" className="border-b">
                    <AccordionTrigger className="py-4 text-base font-medium">
                      Application Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {renderObject(
                          details.ApplicationDetails,
                          details.ApplicationDetails.IsControllerSameAsPermittee ? ["ControllerDetails"] : ["IsControllerSameAsPermittee"]
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {details?.ApplicationType === "permit" && details?.WholesalerVerifiedTimestamp && (
                  <AccordionItem value="wholesaler" className="border-b">
                    <AccordionTrigger className="py-4 text-base font-medium">
                      Wholesaler Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {renderObject( details?.WholesalerDetails )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {details.DocumentsUploaded && Object.keys( details.DocumentsUploaded ).length > 0 && (
                  <AccordionItem value="documents" className="border-b">
                    <AccordionTrigger className="py-4 text-base font-medium">
                      Uploaded Documents
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.keys(( details.DocumentsUploaded )).map(( doc ) => (
                          <div key={doc} className="flex items-center gap-2 p-3 rounded-md border bg-muted/10 hover:bg-muted/20 transition-colors">
                            <FileText className="h-5 w-5 text-primary/70" />
                            <span className="text-sm font-medium">{unCamelize( doc )}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto"
                              onClick={() => {
                                setShowDocumentViewer({
                                  isOpen: true,
                                  documentType: doc,
                                  applicationId: details?.ApplicationId
                                });
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {details.ApplicationStatus === "rejected" && details.Remarks && (
                  <AccordionItem value="rejection" className="border-b">
                    <AccordionTrigger className="py-4 text-base font-medium">
                      Rejection Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <LabeledData
                        className="bg-red-50 text-red-950 p-4 rounded-md"
                        label="Rejection Reason"
                        value={details.Remarks}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="signatures" className="border-b">
                  <AccordionTrigger className="py-4 text-base font-medium">
                    Signatures
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {[ "UserSignature", "InspectorSignature" ].map(( key ) => {
                        if ( !details[key]) {
                          return null;
                        }
                        return (
                          <div key={key} className="bg-muted/20 p-3 rounded-md">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                              {key.replace( /([A-Z])/g, " $1" ).trim()}
                            </Label>
                            <div >
                              <img src={details[key]} alt={key} className="h-fit w-full object-contain max-h-[5rem]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timeline" className="border-b">
                  <AccordionTrigger className="py-4 text-base font-medium">
                    Application Timeline
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Modified: {formatDateTime( details.LastModifiedTime )?.date}</span>
                      </div>
                      {details.SubmissionTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Submitted: {formatDateTime( details.SubmissionTime )?.date}</span>
                        </div>
                      )}
                      {details.InspectionTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {capitalize( details?.ApplicationStatus )}:&nbsp;
                            {[ formatDateTime( details.InspectionTime )?.date, capitalize( details?.InspectorName ?? "-" ) ].join( " by " )}
                          </span>
                        </div>
                      )}
                      {details.StartDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Start Date: {formatDateTime( details.StartDate )?.date}</span>
                        </div>
                      )}
                      {details.ExpirationDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">End Date: {formatDateTime( details.ExpirationDate )?.date}</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>
          <SheetFooter className='p-4'>
            {details.ApplicationStatus === "submitted" && canMarkAsReview &&
              <Button
                variant="outline"
                className="text-orange-500 w-full"
                size="sm"
                onClick={handleMarkAsReview}
              >
                <ClipboardList className="mr-1 h-4 w-4" />
                Mark Under Review
              </Button>
            }
            {details.ApplicationStatus === "in-review" && (
              <div className="flex gap-2">
                {canApprove && (
                  <Button
                    className='flex-1'
                    size="sm"
                    onClick={( e ) => {
                      handleApprove( details );
                      e.stopPropagation();
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                )}
                {canReject && (
                  <Button
                    className='flex-1'
                    variant="destructive"
                    size="sm"
                    onClick={( e ) => {
                      handleDeny( details );
                      e.stopPropagation();
                    }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Deny
                  </Button>
                )}
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <DocumentViewer
        documentType={showDocumentViewer.documentType}
        applicationId={showDocumentViewer.applicationId}
        open={showDocumentViewer.isOpen}
        onClose={() => setShowDocumentViewer( prev => ({ ...prev, isOpen: false }))}
      />
      <UnderReviewModal
        application={details}
        isOpen={isReviewOpen}
        onClose={( refresh ) => {
          if ( refresh ) {
            refetch();
            refetchAllApplications?.();
          }
          setIsReviewOpen( false );
        }}
      />
    </>
  );
};
export default ApplicationDetails;