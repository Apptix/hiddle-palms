import { useState } from "react";
import { AstralTabs, AstralTabsContent, AstralTabsList, AstralTabsTrigger } from "@/components/custom/astral-tabs";
import { useNavigate, useParams } from "react-router";

import { LicenseApplicationForm } from "@/pages/applications/commonForms/LicenseApplicationForm";
import { PermitApplicationForm } from "@/pages/applications/commonForms/PermitApplicationForm";
import PageHeader from "@/components/pageHeader";
import { EmptyState } from "@/components/ui/empty-state/empty-state";

import { urlBuilder } from "@/utils";
import { usePermanentPaths } from "@/hooks";
import { useUserPermission } from "@/hooks/useUserPermissions";

const Tabs = [
  {
    label: "Permit Application",
    value: "permit",
    component: <PermitApplicationForm />
  },
  {
    label: "License Application",
    value: "license",
    component: <LicenseApplicationForm/>
  }
];

const NewApplication = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const permissions = useUserPermission( "applications" );
  const canCreate = permissions.includes( "create" );
  const { applications: { absolutePath } } = usePermanentPaths();
  const { root: { absolutePath: dashboardPath } } = usePermanentPaths();
  const [ activeTab, setActiveTab ] = useState<"permit" | "license">( type === "permit" || type === "license" ? type : "permit" );

  if ( !canCreate ) {
    return (
      <div className="container min-h-[90vh] flex items-center justify-center">
        <EmptyState
          title="No Access"
          description="You don't have access to create application"
          variant="noAccess"
          buttonText="Back to Dashboard"
          onAction={() => navigate( urlBuilder( dashboardPath ))}
        />
      </div>
    );
  }

  return (
    <div className="container py-10 mx-0 px-0">
      <PageHeader heading="New Application" />
      <AstralTabs defaultValue="permit" value={activeTab} onValueChange={( value ) => {
        setActiveTab( value as "permit" | "license" );
        navigate( urlBuilder([ absolutePath, "create", value ]));
      }}>
        <AstralTabsList className="grid grid-cols-2 bg-muted">
          {Tabs.map(( tab ) => (
            <AstralTabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </AstralTabsTrigger>
          ))}
        </AstralTabsList>
        {Tabs.map(( tab ) => (
          <AstralTabsContent key={tab.value} value={tab.value} className="px-0">
            {tab.component}
          </AstralTabsContent>
        ))}
      </AstralTabs>
    </div>
  );
};

export default NewApplication;
