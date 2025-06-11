import { useState } from "react";
import { Download } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Components
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader } from "@/components/ui/loader";
import PdfViewer from "@/components/custom/pdf-viewer";

// Methods / Hooks / Constants / Styles
import { useGetDocumentUrlQuery } from "@/reduxStore/services/documents";
import { downloadDocument } from "@/utils/browserUtils";
import { isPDFFile, unCamelize } from "@/utils/index";

export const DocumentViewer = ({
  documentType,
  applicationId,
  open,
  onClose
}: {
  documentType: string;
  applicationId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [ isDownloading, setIsDownloading ] = useState( false );
  const {
    data: { Message: url = "" } = {},
    isLoading,
    isFetching,
    isError
  } = useGetDocumentUrlQuery({ DocumentType: documentType, ...( applicationId && { ApplicationId: applicationId }) }, { skip: !documentType });

  const closePanel = () => {
    onClose();
  };

  return ( <Dialog open={open} onOpenChange={closePanel}>
    <DialogContent className="max-w-4xl h-[90vh] bg-muted" aria-label="document-preview">
      <DialogTitle className="text-base font-medium hidden"></DialogTitle>
      <DialogDescription className="text-base font-medium">
        Preview of {unCamelize( documentType )}
      </DialogDescription>
      {( isError ) && "Something went wrong !"}
      {isLoading || isFetching ? <div className="flex justify-center items-center h-full"><Loader /></div> :
        url ?
          <ScrollArea className="h-[calc(90vh-8rem)] w-full overflow-auto">
            <div className="flex items-center justify-center p-4">
              {isPDFFile( url ) ?
                <PdfViewer fileUrl={url} /> :
                <img
                  src={url}
                  alt={documentType}
                  className="max-h-full w-auto object-contain"
                />
              }
            </div>
          </ScrollArea>
          : null
      }
      <div className="flex space-x-2 items-end justify-center">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button
          onClick={async () => {
            setIsDownloading( true );
            try {
              await downloadDocument( url, documentType );
            } finally {
              setIsDownloading( false );
            }
          }}
          disabled={isDownloading}
        >
          <Download size={18} className="mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default DocumentViewer;
