import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useGetAppByIdMutation } from "@/reduxStore/services/applications";
import { Button } from "../ui/button";
import { LicenseDocument } from "./licenseDocument";
import { PermitDocument } from "./permitDocument";

interface IPDFDownloadLinkProps {
  resourceId: string;
  type: "permit" | "license";
}

const PDFDownload = ({ resourceId, type = "permit" }: IPDFDownloadLinkProps ) => {
  const downloadInitiated = useRef( false );
  const [ fetchApp, setFetchApp ] = useState( false );
  const [ fetchApplication, { isLoading, isError, data }] = useGetAppByIdMutation();

  useEffect(() => {
    if ( fetchApp && resourceId ) {
      fetchApplication({ applicationId: resourceId });
    }
  }, [ fetchApplication, resourceId, fetchApp ]);

  useEffect(() => {
    if ( fetchApp ) {
      downloadInitiated.current = false;
    }
  }, [fetchApp]);

  useEffect(() => {
    if ( !isLoading && !isError && data && fetchApp && !downloadInitiated.current ) {
      downloadInitiated.current = true;
    }
  }, [ isLoading, isError, data, fetchApp ]);

  if ( isError ) {
    return (
      <div className="flex justify-center items-center h-section">
        Something went wrong!
      </div>
    );
  }

  if ( data && !isLoading ) {
    return (
      <PDFDownloadLink
        className="font-montserrat text-sm justify-center items-center flex"
        document={
          type === "permit" ? <PermitDocument data={data} /> : <LicenseDocument data={data} />
        }
        fileName={`${data?.ApplicationId}.pdf`}
      >
        {({ url, loading, error }) => {
          if ( downloadInitiated.current && url && !loading && !error ) {
            const link = document.createElement( "a" );
            link.href = url;
            link.download = `${data?.ApplicationId}.pdf`;
            document.body.appendChild( link );
            link.click();
            document.body.removeChild( link );
            downloadInitiated.current = false;
          }
          return (
            <span className="text-primary cursor-pointer">
              {`${data?.ApplicationId}.pdf`}
            </span>
          );
        }}
      </PDFDownloadLink>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setFetchApp( true )}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isLoading ? "Generating..." : "Download"}
    </Button>
  );
};

export default PDFDownload;
