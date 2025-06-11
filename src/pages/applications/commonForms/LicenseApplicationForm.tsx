/* eslint-disable max-lines */
import * as z from "zod";
import { PlusIcon, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AstralCard } from "@/components/custom/astral-card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";

import { ValidatePhoneNumber, EntityType, licensType, removePhoneNumberFormatting, sanitizeInputValue, counties } from "@/constants";
import { Validate_Required, capitalize, formatDateTime, urlBuilder } from "@/utils";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { useEditApplicationMutation, useGetApplicationByIdQuery, useSubmitApplicationsMutation } from "@/reduxStore/services/applications";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { zodResolver } from "@hookform/resolvers/zod";

const licenseFormSchema = z.object({
  County: z.object({
    label: z.string(),
    value: z.string()
  }),
  ApplicantType: z.string().optional(),
  ApplicationDetails: z.object({
    EntityType: z.string().min( 1, "Type is required" ).optional(),
    EntityDetails: z.object({
      EntityName: z.string().min( 1, "Name is required" ).optional(),
      Partners: z.array( z.string().min( 1, "Partner name is required" )).optional(),
      Officers: z.array( z.string().min( 1, "Officer name is required" )).optional()
    }).optional(),
    LicenseType: z.string().min( 1, "Licence Type Required" ),
    SiteBusinessName: z.string().optional(),
    SiteAddress: z.string().min( 1, "Site Address is required" ),
    SitePhoneNumber: z.string().optional(),
    FireworksClass: z.string().min( 1, "Firework Class is required" ),
    Quantity: z.string().min( 1, "Quantity is required" ),
    DateActivityBegins: z.date({ message: "Start Date is required" })
  }),
  ApplicationType: z.string(),
  ApplicantName: z.string().min( 1, "Name is required" ),
  ApplicantPhoneNumber: z.string(),
  ApplicantAddress: z.string().min( 1, "Address is required" ),
  ApplicantAge: z.string().refine(( val ) => {
    const age = parseInt( val, 10 );
    return age >= 21 && age <= 130;
  }, {
    message: "Age must be between 21 and 130 years"
  }),
  IsAgreementAccepted: z.boolean().optional(),
  UserSignature: z.string().optional()
  // DocumentsUploaded: z.object().optional()
}).refine(( data ) => {
  if ( data.ApplicantType !== "individual" ) {
    return Boolean( data.ApplicationDetails.EntityType );
  }
  return true;
}, {
  message: "Type is required for business license types",
  path: [ "ApplicationDetails", "EntityType" ]
}).refine(( data ) => {
  if ( data.ApplicantType === "business" ) {
    return data.ApplicationDetails.EntityType &&
           Boolean( data.ApplicationDetails.EntityDetails.EntityName );
  }
  return true;
}, {
  message: "Name is required for business license types",
  path: [ "ApplicationDetails", "EntityDetails", "EntityName" ]
}).refine(( data ) => {
  // Partnership validation - require at least one partner
  if ( data.ApplicationDetails.EntityType === "partnership" && data.ApplicationDetails.EntityDetails.EntityName ) {
    return data.ApplicationDetails.EntityDetails.Partners?.length > 0;
  }
  return true;
}, {
  message: "At least one partner is required for partnerships",
  path: [ "ApplicationDetails", "EntityDetails", "Partners" ]
}).refine(( data ) => {
  // Corporation validation - require at least one officer
  if ( data.ApplicationDetails.EntityType === "corporation" && data.ApplicationDetails.EntityDetails.EntityName ) {
    return data.ApplicationDetails.EntityDetails.Officers?.length > 0;
  }
  return true;
}, {
  message: "At least one officer is required for corporations",
  path: [ "ApplicationDetails", "EntityDetails", "Officers" ]
}).refine(( data ) => {
  // Site business name validation for non-importer license types
  if ( data.ApplicationDetails.LicenseType !== "importer" ) {
    return Boolean( data.ApplicationDetails.SiteBusinessName );
  }
  return true;
}, {
  message: "Business Name is required for this license type",
  path: [ "ApplicationDetails", "SiteBusinessName" ]
}).refine(( data ) => {
  // Site phone number validation for non-importer license types
  if ( data.ApplicationDetails.LicenseType !== "importer" ) {
    return Boolean( data.ApplicationDetails.SitePhoneNumber );
  }
  return true;
}, {
  message: "Phone Number is required for this license type",
  path: [ "ApplicationDetails", "SitePhoneNumber" ]
});

type TLicenseFormValues = z.infer<typeof licenseFormSchema>;

export const LicenseApplicationForm = () => {
  const user = useAppSelector(( state ) => state.account );
  const { applicationId } = useParams();
  const [ submitApplications, { isLoading: isCreating }] = useSubmitApplicationsMutation();
  const [ updateApplications, { isLoading: isUpdating }] = useEditApplicationMutation();
  const navigate = useNavigate();
  const astralAlert = useAstralAlert();
  const { applications: { absolutePath } } = usePermanentPaths();

  const {
    data: appDetails = {},
    isLoading: isAppDetailsLoading
  } = useGetApplicationByIdQuery({ applicationId }, { skip: !applicationId });
  const isEditable = ["draft"].includes( appDetails?.status ) || !applicationId;

  const form = useForm<TLicenseFormValues>({
    resolver: zodResolver( licenseFormSchema ),
    defaultValues: {
      County: {
        label: "Honolulu",
        value: "honolulu"
      },
      ApplicantType: "individual",
      ApplicationDetails: {
        // EntityType: undefined,
        LicenseType: "importer",
        SiteBusinessName: "",
        SiteAddress: "",
        SitePhoneNumber: "",
        FireworksClass: "",
        Quantity: "",
        DateActivityBegins: undefined
      },
      ApplicationType: "license",
      ApplicantName: user ? `${user.FirstName} ${user.LastName}` : "",
      ApplicantPhoneNumber: user?.PhoneNumber || "",
      ApplicantAddress: user?.Address || "",
      ApplicantAge: "",
      IsAgreementAccepted: false,
      UserSignature: ""
    }
  });

  const watchEntityType = form.watch( "ApplicationDetails.EntityType" );
  const applicantTypeWatcher = form.watch( "ApplicantType" ) ?? "";
  const watchPartners = form.watch( "ApplicationDetails.EntityDetails.Partners" );
  const watchOfficers = form.watch( "ApplicationDetails.EntityDetails.Officers" );
  const watchLicenceType = form.watch( "ApplicationDetails.LicenseType" );

  // Add this effect to clear business fields when switching to individual
  useEffect(() => {
    if ( applicationId && !isEditable ) {
      return;
    }

    if ( applicantTypeWatcher === "individual" ) {
      // Clear business-related fields when switching to individual
      form.setValue( "ApplicationDetails.EntityDetails", undefined );
    } else if ( applicantTypeWatcher === "business" ) {
      // Restore default business fields when switching to business
      form.setValue( "ApplicationDetails.EntityDetails", {
        EntityName: "",
        Partners: [],
        Officers: []
      });
    }
  }, [ applicantTypeWatcher, form, applicationId, isEditable ]);

  useEffect(() => {
    if ( applicationId && !isEditable ) {
      return;
    }
    form.setValue( "ApplicationDetails.EntityDetails.EntityName", undefined );
  }, [ watchEntityType, applicationId, isEditable, form ]);

  const onSubmit = async ( isDraft = false ) => {
    let appId = applicationId;
    try {
      const data: TLicenseFormValues = form.getValues();
      const { date, time } = formatDateTime( data?.ApplicationDetails?.DateActivityBegins );
      const payload = {
        ...data,
        County: data?.County?.value,
        ApplicantPhoneNumber: removePhoneNumberFormatting( data?.ApplicantPhoneNumber ),
        ApplicationDetails: {
          ...data?.ApplicationDetails,
          DateActivityBegins: [ date, time ].join( " " ),
          SitePhoneNumber: removePhoneNumberFormatting( data?.ApplicationDetails?.SitePhoneNumber )
        }
      };

      // Filter out empty strings from Partners and Officers arrays if they exist
      if ( payload.ApplicationDetails.EntityDetails?.Partners ) {
        payload.ApplicationDetails.EntityDetails.Partners =
          payload.ApplicationDetails.EntityDetails.Partners.filter( partner => partner.trim() !== "" );
      }

      if ( payload.ApplicationDetails.EntityDetails?.Officers ) {
        payload.ApplicationDetails.EntityDetails.Officers =
          payload.ApplicationDetails.EntityDetails.Officers.filter( officer => officer.trim() !== "" );
      }

      if ( payload.ApplicationDetails.EntityType === "sole-proprietor" ) {
        delete payload.ApplicationDetails.EntityDetails.Partners;
        delete payload.ApplicationDetails.EntityDetails.Officers;
      } else if ( payload.ApplicationDetails.EntityType === "partnership" ) {
        delete payload.ApplicationDetails.EntityDetails.Officers;
      } else if ( payload.ApplicationDetails.EntityType === "corporation" ) {
        delete payload.ApplicationDetails.EntityDetails.Partners;
      } else {
        delete payload.ApplicationDetails.EntityDetails;
      }

      if ( payload.ApplicationDetails.LicenseType === "importer" ) {
        delete payload.ApplicationDetails.SiteBusinessName;
        delete payload.ApplicationDetails.SitePhoneNumber;
      }

      if ( payload.ApplicantType === "individual" ) {
        payload.ApplicationDetails.EntityType = "individual";
      }

      // This is only to control whether to show business details section or not
      delete payload?.ApplicantType;

      if (["draft"].includes( appDetails?.ApplicationStatus ) || !applicationId ) {
        delete payload?.DocumentsUploaded;
        const { Message, ApplicationId } = await submitApplications({
          requestBody: payload,
          requestParams: { save_draft: "yes" }
        }).unwrap();
        appId = ApplicationId;
        if ( Message ) {
          astralAlert.success({
            title: Message
          });
        }
      } else {
        delete payload?.County;
        delete payload?.ApplicationDetails?.EntityType;
        delete payload?.ApplicationDetails?.LicenseType;

        const { Message } = await updateApplications({
          requestBody: payload,
          applicationId
        }).unwrap();
        if ( Message ) {
          astralAlert.success({
            title: Message
          });
        }
      }
    } finally {
      // Navigate based on whether this is a draft save or continue action
      if ( isDraft ) {
        navigate( urlBuilder([absolutePath]));
      } else {
        navigate( urlBuilder([ absolutePath, appId, "upload-documents" ]));
      }
    }
  };

  useEffect(() => {
    if ( applicationId && appDetails ) {
      form.reset( appDetails );
      form.setValue( "County", { label: appDetails?.County, value: appDetails?.County?.toLowerCase() });
      form.setValue( "ApplicantType", appDetails.ApplicationDetails?.EntityDetails ? "business" : "individual" );

      if ( appDetails?.ApplicationDetails?.DateActivityBegins ) {
        form.setValue( "ApplicationDetails.DateActivityBegins", new Date( appDetails.ApplicationDetails.DateActivityBegins ));
      }
    }
  }, [ appDetails, form, applicationId ]);

  // Functions to handle partner and officer lists
  const addPartner = () => {
    const currentPartners = form.getValues( "ApplicationDetails.EntityDetails.Partners" ) || [];
    form.setValue( "ApplicationDetails.EntityDetails.Partners", [ ...currentPartners, "" ]);
  };

  const updatePartner = ( index: number, value: string ) => {
    const currentPartners = [...( form.getValues( "ApplicationDetails.EntityDetails.Partners" ) || [""])];
    currentPartners[index] = value;
    form.setValue( "ApplicationDetails.EntityDetails.Partners", currentPartners );
  };

  const removePartner = ( index: number ) => {
    const currentPartners = [...( form.getValues( "ApplicationDetails.EntityDetails.Partners" ) || [""])];
    const updatedPartners = currentPartners.filter(( _, i ) => i !== index );
    form.setValue( "ApplicationDetails.EntityDetails.Partners", updatedPartners );
  };

  const addOfficer = () => {
    const currentOfficers = form.getValues( "ApplicationDetails.EntityDetails.Officers" ) || [];
    form.setValue( "ApplicationDetails.EntityDetails.Officers", [ ...currentOfficers, "" ]);
  };

  const updateOfficer = ( index: number, value: string ) => {
    const currentOfficers = [...( form.getValues( "ApplicationDetails.EntityDetails.Officers" ) || [""])];
    currentOfficers[index] = value;
    form.setValue( "ApplicationDetails.EntityDetails.Officers", currentOfficers );
  };

  const removeOfficer = ( index: number ) => {
    const currentOfficers = [...( form.getValues( "ApplicationDetails.EntityDetails.Officers" ) || [""])];
    const updatedOfficers = currentOfficers.filter(( _, i ) => i !== index );
    form.setValue( "ApplicationDetails.EntityDetails.Officers", updatedOfficers );
  };

  const licType = capitalize( watchLicenceType );

  if ( isAppDetailsLoading ) {
    return <Loader />;
  }

  return (
    <AstralCard>
      <CardHeader>
        <CardTitle>STATE OF HAWAII FIREWORKS/ARTICLES PYROTECHNIC LICENSE APPLICATION</CardTitle>
        <CardDescription>
          Complete this form to apply for a license to import, store, sell, or offer for sale fireworks or articles pyrotechnic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onSubmit( false ))} className="space-y-8">
            {/* County Selection Card */}
            <FormField
              control={form.control}
              name="County"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={( value ) => field.onChange({ label: value, value })} value={field.value?.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {counties.map(( county ) =>
                        <SelectItem key={county} value={county.toLowerCase()} disabled={county !== "Honolulu"}>{county}</SelectItem> )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Select the county where the activity will take place
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* License Type */}
            <FormField
              control={form.control}
              name="ApplicantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicant Type <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                      disabled={applicationId && !isEditable}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="individual" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Individual
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="business" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Business
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* License Details Card */}
            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium mb-4">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ApplicantName"
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
                  control={form.control}
                  name="ApplicantPhoneNumber"
                  rules={{ validate: ( val ) => Validate_Required( "Phone Number" )( val ) }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.</FormLabel>
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
                  control={form.control}
                  name="ApplicantAddress"
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
                <FormField
                  control={form.control}
                  name="ApplicantAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter age"
                          {...field}
                          onChange={( e ) => field.onChange( e.target.value )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Business Information Section - Conditional on Licensee Type */}
            {applicantTypeWatcher === "business" && (
              <div className="border p-4 rounded-md space-y-4 bg-slate-50">
                <h3 className="text-lg font-medium">Business Information</h3>

                {/* Business Type */}
                <FormField
                  control={form.control}
                  name="ApplicationDetails.EntityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                          disabled={applicationId && !isEditable}
                        >
                          {
                            EntityType?.map(( el, i ) => <FormItem key={i} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={el.value} disabled={applicationId && !isEditable} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {el.label}
                              </FormLabel>
                            </FormItem> )
                          }
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.ApplicationDetails?.EntityDetails && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.ApplicationDetails?.EntityDetails?.message}
                  </p> )
                }
                {/* Sole Proprietor - Business Name */}
                {watchEntityType === "sole-proprietor" && (
                  <FormField
                    control={form.control}
                    name="ApplicationDetails.EntityDetails.EntityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Partnership - Partner Information */}
                {watchEntityType === "partnership" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ApplicationDetails.EntityDetails.EntityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partnership <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Name of partnership" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* For Partners section */}
                    <div className="flex items-center justify-between">
                      <FormLabel>Partners <span className="text-red-500">*</span></FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPartner}
                        disabled={( watchPartners?.length || 0 ) >= 5}
                        className="flex items-center gap-1"
                      >
                        <PlusIcon className="h-4 w-4" /> Add Partner
                      </Button>
                    </div>

                    {form.formState.errors?.ApplicationDetails?.EntityDetails?.Partners ? (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors?.ApplicationDetails?.EntityDetails?.Partners?.message}
                      </p>
                    ) : (
                      !watchPartners || watchPartners.length === 0 ) && (
                      <div className="text-sm text-muted-foreground">
                        No Partners added yet. Click &quot;Add Partner&quot; to add partners.
                      </div>
                    )}

                    {/* {!watchPartners || watchPartners.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No Partners added yet. Click &quot;Add Partner&quot; to add partners.
                      </div> )} */}

                    {watchPartners?.map(( partner, index ) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={`Partner ${index + 1} name`}
                            value={partner}
                            onChange={( e ) => updatePartner( index, e.target.value )}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePartner( index )}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {form.formState.errors?.ApplicationDetails?.EntityDetails?.Partners?.[index]?.message && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors?.ApplicationDetails?.EntityDetails?.Partners?.[index]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Corporation - Corporation Details */}
                {watchEntityType === "corporation" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ApplicationDetails.EntityDetails.EntityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corporation/LLC Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter corporation name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Officers <span className="text-red-500">*</span></FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={( watchOfficers?.length || 0 ) >= 5}
                          onClick={addOfficer}
                          className="flex items-center gap-1"
                        >
                          <PlusIcon className="h-4 w-4" /> Add Officer
                        </Button>
                      </div>

                      {form.formState.errors?.ApplicationDetails?.EntityDetails?.Officers ? (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors?.ApplicationDetails?.EntityDetails?.Officers?.message}
                        </p>
                      ) : (
                        !watchOfficers ||
                        watchOfficers.length === 0 ) && (
                        <div className="text-sm text-muted-foreground">
                          No officers added yet. Click &quot;Add Officer&quot; to add corporate officers.
                        </div>
                      )}
                      {/* {!watchOfficers || watchOfficers.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          No officers added yet. Click &quot;Add Officer&quot; to add corporate officers.
                        </div>
                      )} */}

                      {watchOfficers?.map(( officer, index ) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Officer ${index + 1} name`}
                              value={officer}
                              onChange={( e ) => updateOfficer( index, e.target.value )}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOfficer( index )}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {form.formState.errors?.ApplicationDetails?.EntityDetails?.Officers?.[index]?.message && (
                            <p className="text-sm font-medium text-destructive">
                              {form.formState.errors?.ApplicationDetails?.EntityDetails?.Officers?.[index]?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* License Type */}
            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium">License Type</h3>
              <FormField
                control={form.control}
                name="ApplicationDetails.LicenseType"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>
                        Select License Type <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>

                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      disabled={applicationId && !isEditable}
                    >
                      {licensType?.map(( val ) => (
                        <FormItem
                          key={val.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={val.value}
                              id={val.id}
                              checked={field.value === val.value}
                              disabled={applicationId && !isEditable}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="capitalize" htmlFor={val.value}>
                              {val.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>

                    {form.formState.errors?.ApplicationDetails?.EntityType && (
                      <div className="pt-2">
                        <FormMessage />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </Card>

            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium">
                {licType}{" "}
                Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {watchLicenceType !== "importer" && (
                  <FormField
                    control={form.control}
                    name="ApplicationDetails.SiteBusinessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Business Name of {licType} Site <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Site Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="ApplicationDetails.SiteAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address of {licType === "Importer" ? "Storage" : licType } Site <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Site Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchLicenceType !== "importer" && (
                  <FormField
                    control={form.control}
                    name="ApplicationDetails.SitePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone number of {licType} Site <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="E.g: (808) 555-1234"
                            onChange={( e ) => ValidatePhoneNumber( e, field )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="ApplicationDetails.FireworksClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Fireworks Class <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Fireworks class" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ApplicationDetails.Quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quantity <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter quantity"
                          step={.01}
                          {...field}
                          onChange={( e ) => {
                            const { value } = e.target;
                            if ( !/\.\d{3,}$/.test( value )) {
                              field.onChange( value );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ApplicationDetails.DateActivityBegins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Start Date of {applicantTypeWatcher === "importer" ? "Importation" : "Activity"}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={{ before: new Date() }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <div className="flex justify-between">
              {isEditable && <Button
                variant="ghost"
                className="text-primary"
                type="button"
                disabled={isCreating || isUpdating}
                onClick={() => onSubmit( true )} // Pass true to indicate draft save
              >
                Save as Draft
              </Button>}
              <div className="flex justify-end space-x-4 ms-auto">
                <Button type="button" variant="outline" onClick={() => navigate( urlBuilder( absolutePath ))}>
                  Cancel
                </Button>
                <Button disabled={isCreating || isUpdating} type="submit">
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </AstralCard>
  );
};