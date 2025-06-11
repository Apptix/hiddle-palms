import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetApplicationByIdQuery, useSubmitApplicationsMutation } from "@/reduxStore/services/applications";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/ui/loader";
import SignaturePad from "@/components/ui/signature-pad";
import { EmptyState } from "@/components/ui/empty-state/empty-state";
import { Statutes } from "./Statutes";

import UploadDocument from "@/pages/documents/UploadDocument";
import { getNowHSTDateTime, urlBuilder } from "@/utils";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { useUserPermission } from "@/hooks/useUserPermissions";
import {
  LicenseDocuments, MandatoryDocuments, PermitDocuments, ACCEPTED_EXTENSIONS,
  ValidatePhoneNumber, sanitizeInputValue, removePhoneNumberFormatting, formatPhoneNumber
} from "@/constants";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const UploadApplicationDocuments = () => {
  const { UserSignature } = useAppSelector(( state ) => state.account );
  const permissions = useUserPermission( "applications" );
  const canEdit = permissions.includes( "edit" );
  const canCreate = permissions.includes( "create" );
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [ signature, setSignature ] = useState<string>( UserSignature ?? "" );
  const [ acceptTermsCondition, setAcceptTermsCondition ] = useState<boolean>( false );
  const { data, isLoading: IsApplicationDetailsLoading } = useGetApplicationByIdQuery({ applicationId }, { skip: !applicationId || !canEdit || !canCreate });
  const [ submitApplication, { isLoading }] = useSubmitApplicationsMutation();
  const astralAlert = useAstralAlert();
  const { applications: { absolutePath } } = usePermanentPaths();
  const { root: { absolutePath: dashboardPath } } = usePermanentPaths();

  // Schema that accepts File, UploadedFile, or undefined
  const fileFieldSchema = z.union([
    z.instanceof( File ),
    z.object({
      UploadDate: z.string(),
      Size: z.number(),
      S3Path: z.string()
    }),
    z.undefined()
  ]).transform( val => {
    return val instanceof File ? val : undefined;
  });

  const wholesalerFormSchema = z.object({
    CertificateOfFitness: fileFieldSchema.refine(( file ) => {
      return data?.DocumentsUploaded?.CertificateOfFitness || ( file instanceof File && file.size > 0 );
    }, {
      message: "Certificate Of Fitness is required"
    }),
    DriversLicenseFront: fileFieldSchema.refine(( file ) => {
      return data?.DocumentsUploaded?.DriversLicenseFront || ( file instanceof File && file.size > 0 );
    }, {
      message: "Drivers License Front is required"
    }),
    DriversLicenseBack: fileFieldSchema.refine(( file ) => {
      return data?.DocumentsUploaded?.DriversLicenseBack || ( file instanceof File && file.size > 0 );
    }, {
      message: "Drivers License Back is required"
    }),
    InsuranceCertificate: fileFieldSchema.refine(( file ) => {
      if ( data?.ApplicationType === "permit" ) {
        return data?.DocumentsUploaded?.InsuranceCertificate || ( file instanceof File && file.size > 0 );
      }
      return true;
    }, {
      message: "Insurance Certificate or Policy is required"
    }),
    RightOfEntry: fileFieldSchema.refine(( file ) => {
      if ( data?.ApplicationType === "permit" ) {
        return data?.DocumentsUploaded?.RightOfEntry || ( file instanceof File && file.size > 0 );
      }
      return true;
    }, {
      message: "Right of Entry is required"
    }),
    PlotPlan: fileFieldSchema.refine(( file ) => {
      if ( data?.ApplicationType === "permit" ) {
        return data?.DocumentsUploaded?.PlotPlan || ( file instanceof File && file.size > 0 );
      }
      return true;
    }, "Plot Plan of Firing Area is required" ),
    FederalStorageLicense: fileFieldSchema.refine(( file ) => {
      if ( data?.ApplicationType === "license" ) {
        return data?.DocumentsUploaded?.FederalStorageLicense || ( file instanceof File && file.size > 0 );
      }
      return true;
    }, "Federal Storage License is required" ),
    FederalImportLicense: fileFieldSchema.refine(( file ) => {
      if ( data?.ApplicationType === "license" ) {
        return data?.DocumentsUploaded?.FederalImportLicense || ( file instanceof File && file.size > 0 );
      }
      return true;
    }, "Federal Import License is required" ),
    WholesalerVerifiedTimestamp: z.string().refine(( value ) => {
      if ( data?.ApplicationType === "permit" ) {
        return value.length > 0;
      }
      return true;
    }, "Wholesaler Signature is required" ),
    WholesalerName: z.string().refine(( value ) => {
      if ( data?.ApplicationType === "permit" ) {
        return value.length > 0;
      }
      return true;
    }, "Name is required" ),
    WholesalerPhoneNumber: z.string().refine(( value ) => {
      if ( data?.ApplicationType === "permit" ) {
        return /^\(\d{3}\) \d{3}-\d{4}$/.test( value );
      }
      return true;
    }, "Phone number is invalid" ),
    WholesalerAddress: z.string().refine(( value ) => {
      if ( data?.ApplicationType === "permit" ) {
        return value.length > 0;
      }
      return true;
    }, "Address is required" )
  });

  type TWholesalerFormValues = z.infer<typeof wholesalerFormSchema>;

  const formUtils = useForm<TWholesalerFormValues>({
    resolver: zodResolver( wholesalerFormSchema ),
    defaultValues: {
      WholesalerVerifiedTimestamp: "",
      WholesalerName: "",
      WholesalerPhoneNumber: "",
      WholesalerAddress: ""
    }
  });
  const { handleSubmit, watch } = formUtils;
  const watchWholesalerVerifiedTimestamp = watch( "WholesalerVerifiedTimestamp" );
  const isDraftable = ["draft"].includes( data?.ApplicationStatus ) || !applicationId;

  useEffect(() => {

    formUtils.reset({
      ...data?.DocumentsUploaded,
      WholesalerVerifiedTimestamp: data?.WholesalerVerifiedTimestamp || "",
      WholesalerName: data?.WholesalerDetails?.WholesalerName || "",
      WholesalerPhoneNumber: formatPhoneNumber( data?.WholesalerDetails?.WholesalerPhoneNumber ) || "",
      WholesalerAddress: data?.WholesalerDetails?.WholesalerAddress || ""
    });
    setSignature( data?.UserSignature ? data?.UserSignature : UserSignature );
    setAcceptTermsCondition( data?.IsAgreementAccepted );
  }, [ data, formUtils, UserSignature ]);

  const onSubmit = async ( saveAsDraft: boolean = false ) => {
    const formData: TWholesalerFormValues = formUtils.getValues();
    const { Message } = await submitApplication({
      requestBody: {
        IsAgreementAccepted: acceptTermsCondition,
        UserSignature: signature,
        ApplicationId: applicationId,
        ...( data?.ApplicationType === "permit" &&
          {
            WholesalerVerifiedTimestamp: formData?.WholesalerVerifiedTimestamp,
            ...( formData?.WholesalerVerifiedTimestamp && {
              WholesalerDetails: {
                WholesalerName: formData?.WholesalerName,
                WholesalerPhoneNumber: removePhoneNumberFormatting( formData?.WholesalerPhoneNumber ),
                WholesalerAddress: formData?.WholesalerAddress
              }
            })
          }
        )
      },
      requestParams: saveAsDraft ? { save_draft: "yes" } : {}
    }).unwrap();
    if ( Message ) {
      astralAlert.success({
        title: Message
      });
      navigate( urlBuilder([ absolutePath, applicationId, "success" ]));
    }
  };

  if ( IsApplicationDetailsLoading ) {
    return <Loader />;
  };

  if ( !canEdit || !canCreate ) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <EmptyState
          title="No Access"
          description="You don't have access to edit application"
          variant="noAccess"
          buttonText="Back to Dashboard"
          onAction={() => navigate( urlBuilder( dashboardPath ))}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => navigate( `/applications/${applicationId}/edit` )}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">Upload Document</h1>
      </div>
      <Form {...formUtils}>
        <form onSubmit={handleSubmit(() => onSubmit( false ))}>
          <Card className="p-6 bg-slate-50">
            <h3 className="text-lg font-medium">Documents and Approvals</h3>
            <p className="text-sm text-muted-foreground mb-4">Accepted file types: {ACCEPTED_EXTENSIONS.join( ", " )}</p>
            <UploadDocument
              formUtils={formUtils}
              showHeader={false}
              applicationId={applicationId}
              documents={[
                ...MandatoryDocuments,
                ...( data?.ApplicationType === "permit" ? PermitDocuments : LicenseDocuments )
              ]}
            />
          </Card>
          {/* Wholesaler Details */}
          {data?.ApplicationType === "permit" && (
            <Card className="p-6 bg-slate-50 mt-6">
              <h3 className="text-lg font-medium mb-4">Wholesaler Details</h3>
              <div className="mb-4">
                <FormField
                  control={formUtils.control}
                  name="WholesalerVerifiedTimestamp"
                  rules={{
                    required: "required"
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={Boolean( field.value )}
                          onCheckedChange={( checked ) => {
                            formUtils.setValue(
                              "WholesalerVerifiedTimestamp",
                              checked ? getNowHSTDateTime() : undefined
                            );
                          }} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I acknowledge that the wholesaler who provided the fireworks has signed the required documentation.</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {watchWholesalerVerifiedTimestamp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={formUtils.control}
                    name="WholesalerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formUtils.control}
                    name="WholesalerPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone No.<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="E.g: (808) 555-1234"
                            onChange={( e ) => ValidatePhoneNumber( e, field )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formUtils.control}
                    name="WholesalerAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address<span className="text-red-500">*</span></FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Enter address"
                            {...field}
                            onBlur={( e ) => {
                              const cleanValue = sanitizeInputValue( e.target.value );
                              field.onChange( cleanValue );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </Card>
          )}
          {/* Signature and Terms Card */}
          <Card className="p-6 mt-6 bg-slate-50">
            <h3 className="text-lg font-medium mb-4">Signature and Terms</h3>
            <div className="flex flex-col items-start justify-start gap-4">
              Signature
              <div className="max-w-md">
                <SignaturePad
                  value={data?.UserSignature ? data?.UserSignature : signature}
                  onChange={( value ) => {
                    setSignature( value );
                  }}
                />
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={acceptTermsCondition}
                  onCheckedChange={() => {
                    if ( acceptTermsCondition ) {
                      setAcceptTermsCondition( false );
                      return;
                    }
                    document.getElementById( "hrs-statutes" )?.click();
                  }}
                />
                <span>I certify that the information provided in this application is true and correct to the best of my knowledge. I understand that providing
                  false information may result in denial of my application and/or legal penalties.&nbsp;
                <Statutes onAcknowledge={() => setAcceptTermsCondition( true )} acknowledged={acceptTermsCondition} />
                </span>
              </div>
            </div>
          </Card>
          <div className="flex justify-between mt-6">
            {isDraftable && <Button
              type="button"
              variant="ghost"
              className="text-primary"
              disabled={isLoading}
              onClick={() => onSubmit( true )}
            >
              Save as Draft
            </Button>}
            <div className="flex justify-end space-x-4  ms-auto">
              <Button type="button" variant="outline" onClick={() => navigate( "/applications" )}>
                Cancel
              </Button>
              <Button
                disabled={!signature || !acceptTermsCondition || ( data?.ApplicationType === "permit" && !watchWholesalerVerifiedTimestamp ) || isLoading}
                type="submit"
              >
                {data?.ApplicationStatus === "submitted" ? "Edit " : "Submit "} Application
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};