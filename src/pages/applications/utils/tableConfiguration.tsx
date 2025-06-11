import { Check, Pencil, Trash, X } from "lucide-react";
import { useNavigate } from "react-router";

import { TApplicationStatus, statusColors } from "@/constants";
import { Button } from "@/components/ui/button";
import { IColumn } from "@/components/custom/data-table";
import PDFDownload from "@/components/pdfGenerator/pdfDownloadLink";

import { capitalize, formatDateTime, urlBuilder } from "@/utils";
import { usePermanentPaths } from "@/hooks/usePermanentPaths";

export interface IApplication {
  ApplicationId: string;
  ApplicationType: "license" | "permit";
  LicenseType: string;
  County: string;
  ApplicantUserId: string;
  ApplicantName: string;
  ApplicationStatus: TApplicationStatus;
  SubmissionTime: string | null;
  LastModifiedTime: string;
}

export const formatStatus = ( status: TApplicationStatus ): string => {
  return capitalize( status.replace( "-", " " ));
};

interface ITableConfigProps {
  handleDeny: ( app: IApplication ) => void;
  handleApprove: ( app: IApplication ) => void;
  handleDelete: ( app: IApplication ) => void;
  permissions: string[];
}

export const useApplicationColumns = ({
  handleDeny,
  handleApprove,
  handleDelete,
  permissions
}: ITableConfigProps ): IColumn<IApplication>[] => {
  const canEdit = permissions.includes( "edit" );
  const canApprove = permissions.includes( "approve" );
  const canReject = permissions.includes( "reject" );
  const canRevoke = permissions.includes( "revoke" );
  const navigate = useNavigate();
  const { applications: { absolutePath } } = usePermanentPaths();
  return [
    {
      key: "ApplicantName",
      header: "Applicant Name",
      render: ( value: string ) => value ? capitalize( value ) : "-"
    },
    {
      key: "ApplicationType",
      header: "Type",
      render: ( value: string, row: IApplication ) => value ?
        ( row.ApplicationType === "license" ? `${capitalize( row?.LicenseType )} ` : "" ) + capitalize( value ) : "-"
    },
    {
      key: "SubmissionTime",
      header: "Submitted",
      render: ( value: Date ) => formatDateTime( value )?.date
    },
    {
      key: "ApplicationStatus",
      header: "Status",
      render: ( value: TApplicationStatus ) => (
        <span className={`font-montserrat inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[value]}`}>
          {formatStatus( value )}
        </span>
      )
    },
    {
      key: "County",
      header: "County",
      render: ( value: string ) => value ? capitalize( value ) : "-"
    },
    {
      key: "actions",
      header: "Actions",
      render: ( _, row: IApplication ) => {
        return (
          <div className="flex justify-start space-x-2" onClick={( e ) => e.stopPropagation()}>
            {row.ApplicationStatus === "in-review" && (
              <>
                {canApprove && (
                  <Button
                    size="sm"
                    onClick={( e ) => {
                      handleApprove( row );
                      e.stopPropagation();
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                )}
                {canReject && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={( e ) => {
                      handleDeny( row );
                      e.stopPropagation();
                    }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Deny
                  </Button>
                )}
              </>
            )}
            {canEdit &&
              <Button
                size="sm"
                variant="outline"
                disabled={![ "submitted", "pending", "draft" ].includes( row?.ApplicationStatus )}
                onClick={( e ) => {
                  e.stopPropagation();
                  navigate( urlBuilder([ absolutePath, row.ApplicationId, "edit" ]));
                }}
              >
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
            }
            {canRevoke &&
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete( row )}
                disabled={[ "in-review", "approved", "rejected", "expired" ].includes( row?.ApplicationStatus )}
              >
                <Trash className="mr-1 h-4 w-4" />
                Delete
              </Button>
            }
            <PDFDownload resourceId={row?.ApplicationId} type={row?.ApplicationType} />
          </div>
        );
      }
    }
  ];
};

export const applicationFilters = [
  {
    key: "ApplicationStatus",
    label: "Application Status",
    options: [
      { value: "submitted", label: "Submitted" },
      { value: "in-review", label: "In Review" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" }
    ]
  },
  {
    key: "ApplicationType",
    label: "Application Type",
    options: [
      { value: "permit", label: "Permit" },
      { value: "license", label: "License" }
    ]
  }
];