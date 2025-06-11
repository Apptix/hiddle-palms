import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router";

import { LicenseDocument } from "./licenseDocument";
import { PermitDocument } from "./permitDocument";
import { useGetApplicationByIdQuery } from "@/reduxStore/services/applications";
import PageHeader from "../pageHeader";
import { Loader } from "../ui/loader";
import { urlBuilder } from "@/utils";
import { usePermanentPaths } from "@/hooks";

const PDFGenerator = () => {
  const { applicationId } = useParams();
  const { applications: { absolutePath } } = usePermanentPaths();

  const {
    data: Application,
    isLoading,
    isFetching,
    isError
  } = useGetApplicationByIdQuery({ applicationId }, { skip: ( !applicationId ) });

  if ( !applicationId || ( Application && Object.keys( Application ).length === 0 )) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Application Not Found</h2>
        <a href={urlBuilder( absolutePath )} className="text-blue-500 hover:text-blue-700 underline">
          Return to Applications
        </a>
      </div>
    </div>;
  }

  if ( isError ) {
    return <div className="flex justify-center items-center h-section">
      Something went wrong!
    </div>;
  }

  if ( isLoading || isFetching ) {
    return <Loader />;
  }

  return (
    <div style={{ width: "100%", height: "95vh" }}>
      <PageHeader
        heading="PDF Preview"
        showBackButton
      />
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        {Application?.ApplicationType === "permit"
          ? <PermitDocument data={Application} />
          : <LicenseDocument data={Application} />
        }
      </PDFViewer>
    </div>
  );
};

export default PDFGenerator;
