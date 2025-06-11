import FileUploader from "@/components/fileUploader";
import { TDocument } from "@/constants";

const UploadDocument = ({
  formUtils,
  documents = [],
  applicationId
}: {
  formUtils: any;
  documents?: TDocument[];
  applicationId?: string;
  showHeader?: boolean;
}) => {
  return (
    <form className="flex flex-col gap-4">
      {documents?.map(( doc ) => (
        <FileUploader key={doc.type} doc={doc} formUtils={formUtils} applicationId={applicationId} />
      ))}
    </form>
  );
};

export default UploadDocument;
