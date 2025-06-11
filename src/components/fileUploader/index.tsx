import { Edit, Eye, FileImage, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Controller } from "react-hook-form";
import DocumentViewer from "../custom/document-viewer";
import { Progress } from "../ui/progress";
// Libraries
import axios from "axios";
import { useGetPreSignedUrlMutation } from "@/reduxStore/services/documents";
import { ACCEPTED_EXTENSIONS, getMiddleEllipsedText } from "@/constants";

const FileUploader = ({
  formUtils,
  doc,
  applicationId
}: any ) => {
  const { name, type, description, required = true } = doc;
  const { control = {}, formState: { errors = {} }, getValues, clearErrors } = formUtils ?? { control: {}, formState: { errors: {} } };
  const [ edit, setEdit ] = useState( false );
  const [ uploadState, setUploadState ] = useState<Record<string, {
    error?: boolean;
    helperText: React.ReactNode;
    uploaded: boolean;
    loading?: boolean;
    progress?: number;
  }>>({});
  const [ showDocumentViewer, setShowDocumentViewer ] = useState<{
    isOpen: boolean;
    documentType: string;
    applicationId: string;
  }>({
    isOpen: false,
    documentType: "",
    applicationId: ""
  });

  const [getPresignedURL] = useGetPreSignedUrlMutation();

  const uploadFiles = useCallback(
    async ( file: any, onChange: any ) => {
      const fileName = file?.name;
      setUploadState({
        [type]: {
          helperText: fileName,
          error: false,
          uploaded: false,
          loading: true,
          progress: 0
        }
      });
      try {
        const { Message: uploadURL }: { Message: string } = await getPresignedURL({
          FileName: fileName, DocumentType: type, ...( applicationId && type !== "other" && {
            ApplicationId: applicationId
          })
        }).unwrap();
        const fileUploadResponse = await axios.put( uploadURL, file, {
          headers: {
            "Content-Type": file.type
          },
          onUploadProgress: ( progressEvent ) => {
            const progress = Math.round(( progressEvent.loaded * 100 ) / ( progressEvent.total ?? 1 ));
            setUploadState( prev => ({
              [type]: {
                ...prev[type],
                progress
              }
            }));
          }
        });
        if ( fileUploadResponse?.status === 200 ) {
          setUploadState({
            [type]: {
              helperText: fileName,
              error: false,
              uploaded: true,
              loading: false,
              progress: 100
            }
          });
          onChange( file );
          clearErrors( type );
        }
      } catch ( e ) {
        setUploadState({
          [type]: {
            helperText: ( e as any )?.message ?? "An error occured while uploading the file",
            error: true,
            uploaded: false,
            loading: false,
            progress: 0
          }
        });
      }
    },
    [ getPresignedURL, setUploadState, applicationId, type, clearErrors ]
  );

  const openDocumentViewer = useCallback(() => {
    setShowDocumentViewer({
      isOpen: true,
      documentType: type,
      applicationId
    });
  }, [ setShowDocumentViewer, type, applicationId ]);

  return (
    <>
      <Card key={type} className="p-4 bg-background shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <FileImage className="h-6 w-6 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          {
            getValues()?.[type] && !edit ?
              <div className="flex gap-2">
                <Eye onClick={openDocumentViewer} className="h-4 w-4 cursor-pointer" />
                <Edit className="h-4 w-4 cursor-pointer" onClick={() => setEdit( true )} />
              </div>
              :
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById( `file-upload-${type}` )?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadState?.[`${type}`]?.uploaded ? "Replace" : "Upload"}
                <Controller
                  name={type}
                  control={control}
                  rules={ required ? {
                    required: `${name} is required`
                  } : {} }
                  render={({ field: { onChange, ...rest } }) => (
                    <input
                      {...rest}
                      accept={ACCEPTED_EXTENSIONS.join( "," )}
                      id={`file-upload-${type}`}
                      type="file"
                      className="hidden"
                      value={undefined}
                      onChange={( e ) => {
                        const file = e.target.files?.[0];
                        // onChange( file );
                        uploadFiles( file, onChange );
                      }}
                    />
                  )}
                />
              </Button>
          }
        </div>
        <p className="text-red-500">{
          uploadState?.[`${type}`]?.error ? uploadState?.[`${type}`]?.helperText : errors?.[`${type}`]?.message
        }</p>
        {uploadState?.[`${type}`]?.loading && (
          <div className="mt-4">
            <Progress value={uploadState[type]?.progress} className="w-full" />
            <p className="text-sm text-primary mt-1">
              Uploading... {uploadState[type]?.progress}%
            </p>
          </div>
        )}
        {uploadState?.[`${type}`]?.uploaded && <Button type="button" variant="link" onClick={openDocumentViewer}>
          {typeof uploadState?.[`${type}`]?.helperText === "string" &&
            ( uploadState[`${type}`].helperText as string ).length > 50
            ? `${getMiddleEllipsedText( uploadState[`${type}`].helperText as string, 30 )}`
            : uploadState?.[`${type}`]?.helperText}
        </Button>}
      </Card>
      {showDocumentViewer.isOpen && <DocumentViewer
        documentType={showDocumentViewer.documentType}
        applicationId={showDocumentViewer.applicationId}
        open={showDocumentViewer.isOpen}
        onClose={() => setShowDocumentViewer({ documentType: type, applicationId, isOpen: false })}
      />}
    </>
  );
};

export default FileUploader;
