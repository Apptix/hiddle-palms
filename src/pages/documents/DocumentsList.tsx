import {
  Eye,
  File,
  FileText,
  Image,
  Trash2,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DocumentViewer from "@/components/custom/document-viewer";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import PageHeader from "@/components/pageHeader";
import DeleteConfirmation from "./components/deleteModal";

import { unCamelize, urlBuilder } from "@/utils";
import { useGetUserDocumentsQuery } from "@/reduxStore/services/user";
import { useUserPermission } from "@/hooks/useUserPermissions";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { Loader } from "@/components/ui/loader";

// Helper function to get icon based on file type
const getFileIcon = ( fileType: string ) => {
  if ( fileType.startsWith( "image" )) {
    return <Image size={18} />;
  }
  if ( fileType.includes( "pdf" )) {
    return <FileText size={18} />;
  }
  return <File size={18} />;
};

// Helper function to format file size
const formatFileSize = ( bytes?: number ) => {
  if ( !bytes ) {
    return "Unknown size";
  }

  if ( bytes < 1024 ) {
    return `${bytes} B`;
  }
  if ( bytes < 1024 * 1024 ) {
    return `${( bytes / 1024 ).toFixed( 1 )} KB`;
  }
  return `${( bytes / ( 1024 * 1024 )).toFixed( 1 )} MB`;
};

const DocumentsList = () => {
  const navigate = useNavigate();
  const permissions = useUserPermission( "documents" );
  const canView = permissions.includes( "view" );

  const [ selectedDocumentType, setSelectedDocumentType ] = useState<string | null>( null );
  const [ showDeleteDialog, setShowDeleteDialog ] = useState( false );
  const [ showPreviewDialog, setShowPreviewDialog ] = useState( false );
  const { username } = useAppSelector(( state ) => state.auth );
  const { data: documents, isLoading, isFetching, refetch, isError } = useGetUserDocumentsQuery({ userName: username }, {
    skip: !canView,
    refetchOnMountOrArgChange: true
  });
  const { root: { absolutePath: dashboardAbsPath }, documents: { absolutePath: documentsAbsPath } } = usePermanentPaths();

  const handleView = ( type: string ) => {
    setSelectedDocumentType( type );
    setShowPreviewDialog( true );
  };

  const handleDelete = ( type: string ) => {
    setSelectedDocumentType( type );
    setShowDeleteDialog( true );
  };

  if ( !canView ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Access"
          description="You don't have access to the Documents"
          variant="noAccess"
          buttonText="Back to Dashboard"
          onAction={() => navigate( urlBuilder( dashboardAbsPath ))}
        />
      </div>
    );
  }

  if ( isError ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="Error"
          description="Something went wrong, Please try again."
          variant="emptyData"
          buttonText="Try again"
          onAction={refetch}
          imageClassName="h-96 w-96"
        />
      </div>
    );
  }

  return (
    <div className="container py-10 px-0 mx-0">
      <PageHeader heading="My Documents" cta={
        <Button onClick={() => navigate( urlBuilder([ documentsAbsPath, "upload-document" ]))}>
          <Upload size={18} className="mr-2" />
          Upload Document
        </Button>
      } />
      {
        isLoading || isFetching ? <Loader />
          :
          !documents || ( documents && Object.keys( documents )?.length === 0 ) ?
            <Card>
              <div className="text-center p-8">
                <p className="text-lg mb-4">No documents found</p>
                <Button onClick={() => navigate( urlBuilder([ documentsAbsPath, "upload-document" ]))}>
                  <Upload size={18} className="mr-2" />
                  Upload New Document
                </Button>
              </div>
            </Card>
            :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys( documents ).map(( doc ) => (
                <Card key={doc}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getFileIcon( doc )}
                        <h2 className="text-lg font-medium ml-2">{unCamelize( doc )}</h2>
                      </div>
                      <Badge className="capitalize bg-muted text-primary">
                        {"Identification"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{formatFileSize( documents[doc].Size )}</span>
                      <span>{new Date( documents[doc].UploadDate ).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete( doc )}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleView( doc )}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
      }
      <DeleteConfirmation
        showDeleteModal={showDeleteDialog}
        setShowDeleteModal={setShowDeleteDialog}
        resourceId={selectedDocumentType}
        onConfirm={() => {
          setSelectedDocumentType( undefined );
          refetch();
        }}
        onCancel={() => {
          setSelectedDocumentType( undefined );
        }}
      />
      <DocumentViewer
        documentType={selectedDocumentType}
        applicationId={""}
        open={showPreviewDialog}
        onClose={() => {
          setShowPreviewDialog( false );
          setSelectedDocumentType( null );
        }}
      />
    </div>
  );
};

export default DocumentsList;