
import { useNavigate, useParams } from "react-router";

import { LicenseApplicationForm } from "@/pages/applications/commonForms/LicenseApplicationForm";
import { PermitApplicationForm } from "@/pages/applications/commonForms/PermitApplicationForm";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state/empty-state";

import { useGetApplicationByIdQuery } from "@/reduxStore/services/applications";
import { useUserPermission } from "@/hooks/useUserPermissions";
import { urlBuilder } from "@/utils";
import { usePermanentPaths } from "@/hooks";

const NewApplication = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const permissions = useUserPermission( "applications" );
  const canEdit = permissions.includes( "edit" );
  const { root: { absolutePath } } = usePermanentPaths();

  const {
    data: appDetails = {},
    isLoading: isAppDetailsLoading
  } = useGetApplicationByIdQuery({ applicationId }, { skip: !applicationId || !canEdit });

  if ( !canEdit ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Access"
          description="You don't have access to edit application"
          variant="noAccess"
          buttonText="Back to Dashboard"
          onAction={() => navigate( urlBuilder( absolutePath ))}
        />
      </div>
    );
  }

  return (
    <div className="container py-10 px-0 mx-0">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Application</h1>
      </div>
      {isAppDetailsLoading ?
        <Loader />
        :
        appDetails?.ApplicationType === "permit" ? <PermitApplicationForm /> : <LicenseApplicationForm />
      }
    </div>
  );
};

export default NewApplication;
