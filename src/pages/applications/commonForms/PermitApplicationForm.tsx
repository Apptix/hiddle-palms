/* eslint-disable max-lines */
import * as z from "zod";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AstralCard } from "@/components/custom/astral-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";

import { ValidatePhoneNumber, counties, eventType, formatPhoneNumber, removePhoneNumberFormatting, sanitizeInputValue } from "@/constants";
import { Validate_Required, formatDateTime, urlBuilder } from "@/utils";
import { useAppSelector, usePermanentPaths } from "@/hooks";
import { useEditApplicationMutation, useGetApplicationByIdQuery, useSubmitApplicationsMutation } from "@/reduxStore/services/applications";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { zodResolver } from "@hookform/resolvers/zod";

const permitFormSchema = z.object({
  County: z.object({
    label: z.string(),
    value: z.string()
  }),
  ApplicationDetails: z.object({
    EventType: z.enum([ "outdoor-display", "proximate-audience" ]),
    IsControllerSameAsPermittee: z.boolean(),
    ControllerDetails: z.object({
      ControllerName: z.string().min( 1, "Name is required" ),
      ControllerPhoneNumber: z.string().min( 1, "Phone number is required" ).regex( /^\(\d{3}\) \d{3}-\d{4}$/, {
        message: "Phone number is invalid"
      }),
      ControllerAddress: z.string().min( 1, "Address is required" ),
      ControllerAge: z.string().refine(( val ) => {
        const age = parseInt( val, 10 );
        return age >= 21 && age <= 130;
      }, {
        message: "Age must be between 21 and 130 years"
      })
    }).optional(),
    NameOfDisplay: z.string().min( 1, "Display name is required" ),
    Quantity: z.string().min( 1, "Quantity is required" ),
    TMK: z.string().min( 1, "TMK is required" ),
    FiringDate: z.date(),
    FiringTime: z.string().min( 1, "Firing time is required" ),
    FireworksClass: z.string().min( 1, "Fireworks class is required" ),
    LocationAddress: z.string().min( 1, "Address is required" )
  }).refine(( appData ) => {
    const { IsControllerSameAsPermittee, ControllerDetails } = appData;
    if ( IsControllerSameAsPermittee ) {
      return true;
    } else {
      return Boolean(
        ControllerDetails.ControllerAddress && ControllerDetails.ControllerAge && ControllerDetails.ControllerName && ControllerDetails.ControllerPhoneNumber
      );
    }
  }, {
    message: "Controller details are required if Controller is not same as applicant",
    path: [ "ApplicationDetails", "ControllerDetails" ]
  }),
  ApplicationType: z.string(),
  ApplicantName: z.string().min( 1, "Name is required" ),
  ApplicantPhoneNumber: z.string().min( 1, "Phone number is required" ).regex( /^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Phone number is invalid"
  }),
  ApplicantAddress: z.string().min( 1, "Address is required" ),
  ApplicantAge: z.string().refine(( val ) => {
    const age = parseInt( val, 10 );
    return age >= 21 && age <= 130;
  }, {
    message: "Age must be between 21 and 130 years"
  }),
  IsAgreementAccepted: z.boolean(),
  UserSignature: z.string()
});

type TPermitFormValues = z.infer<typeof permitFormSchema>;

export const PermitApplicationForm = () => {
  const user = useAppSelector(( state ) => state.account );
  const [ submitApplication, { isLoading: isCreating }] = useSubmitApplicationsMutation();
  const [ updateApplications, { isLoading: isUpdating }] = useEditApplicationMutation();
  const navigate = useNavigate();
  const astralAlert = useAstralAlert();
  const { applicationId } = useParams();
  const { applications : { absolutePath } } = usePermanentPaths();

  const {
    data: appDetails = {},
    isLoading: isAppDetailsLoading
  } = useGetApplicationByIdQuery({ applicationId }, { skip: !applicationId });
  const isDraftable = ["draft"].includes( appDetails?.ApplicationStatus ) || !applicationId;

  const form = useForm<TPermitFormValues>({
    resolver: zodResolver( permitFormSchema ),
    defaultValues: {
      County: {
        label: "Honolulu",
        value: "honolulu"
      },
      ApplicationDetails: {
        EventType: "outdoor-display",
        IsControllerSameAsPermittee: true,
        ControllerDetails: {
          ControllerName: "",
          ControllerPhoneNumber: "",
          ControllerAge: "",
          ControllerAddress: ""
        },
        NameOfDisplay: "",
        Quantity: "",
        TMK: "",
        FiringDate: new Date(),
        FiringTime: "",
        FireworksClass: "",
        LocationAddress: ""
      },
      ApplicationType: "permit",
      ApplicantName: user ? `${user.FirstName} ${user.LastName}` : "",
      ApplicantPhoneNumber: user?.PhoneNumber || "",
      ApplicantAddress: user?.Address || "",
      ApplicantAge: "",
      IsAgreementAccepted: false,
      UserSignature: ""
    }
  });

  const watchControllerSameAsPermittee = form.watch( "ApplicationDetails.IsControllerSameAsPermittee" );
  const { ApplicantName, ApplicantPhoneNumber, ApplicantAddress, ApplicantAge } = form.getValues();

  React.useEffect(() => {
    if ( watchControllerSameAsPermittee ) {
      form.setValue( "ApplicationDetails.ControllerDetails.ControllerName", ApplicantName );
      form.setValue( "ApplicationDetails.ControllerDetails.ControllerPhoneNumber", ApplicantPhoneNumber );
      form.setValue( "ApplicationDetails.ControllerDetails.ControllerAddress", ApplicantAddress );
      form.setValue( "ApplicationDetails.ControllerDetails.ControllerAge", ApplicantAge );
    }
  }, [ watchControllerSameAsPermittee, ApplicantName, ApplicantPhoneNumber, ApplicantAddress, ApplicantAge, form ]);

  const onSubmit = async ( isDraft = false ) => {
    let appId = applicationId;
    try {
      const data: TPermitFormValues = form.getValues();
      const { date, time } = formatDateTime( data?.ApplicationDetails?.FiringDate );
      const applicationDetails = { ...data.ApplicationDetails };
      const payload = {
        ...data,
        County: data?.County?.value,
        ApplicantPhoneNumber: removePhoneNumberFormatting( data.ApplicantPhoneNumber ),
        ApplicationDetails: {
          ...applicationDetails,
          FiringDate: [ date, time ].join( " " ),
          ...( data?.ApplicationDetails?.IsControllerSameAsPermittee ? {
            ControllerDetails: {
              ControllerName: data.ApplicantName,
              ControllerPhoneNumber: removePhoneNumberFormatting( data.ApplicantPhoneNumber ),
              ControllerAge: data.ApplicantAge,
              ControllerAddress: data.ApplicantAddress
            }
          } : {
            ControllerDetails: {
              ControllerName: data.ApplicationDetails?.ControllerDetails?.ControllerName,
              ControllerPhoneNumber: removePhoneNumberFormatting( data.ApplicationDetails?.ControllerDetails?.ControllerPhoneNumber ),
              ControllerAge: data.ApplicationDetails?.ControllerDetails?.ControllerAge,
              ControllerAddress: data.ApplicationDetails?.ControllerDetails?.ControllerAddress
            }
          })
        }
      };

      delete payload?.DocumentsUploaded;
      if (["draft"].includes( appDetails?.ApplicationStatus ) || !applicationId ) {
        const { Message, ApplicationId } = await submitApplication({
          requestBody: payload,
          requestParams: { save_draft: "yes" }
        }).unwrap();
        appId = ApplicationId;
        astralAlert.success({
          title: Message
        });
        navigate( urlBuilder([ absolutePath, ApplicationId, "upload-documents" ]));
      } else {
        delete payload?.ApplicationDetails?.EventType;
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
      form.setValue( "ApplicantPhoneNumber", formatPhoneNumber( appDetails?.ApplicantPhoneNumber ));

      if ( !appDetails?.ApplicationDetails.ControllerDetails.IsControllerSameAsPermittee ){
        form.setValue( "ApplicationDetails.ControllerDetails.ControllerPhoneNumber",
          formatPhoneNumber( appDetails?.ApplicationDetails?.ControllerDetails.ControllerPhoneNumber ));
      }

      if ( appDetails?.ApplicationDetails?.FiringDate ) {
        form.setValue( "ApplicationDetails.FiringDate", new Date( appDetails.ApplicationDetails.FiringDate ));
      }

      if ( appDetails?.ApplicationDetails?.FiringTime ) {
        form.setValue( "ApplicationDetails.FiringTime", appDetails.ApplicationDetails.FiringTime );
      }
    }
  }, [ appDetails, form, applicationId ]);

  if ( isAppDetailsLoading ) {
    return <Loader />;
  }

  return (
    <AstralCard>
      <CardHeader>
        <CardTitle>STATE OF HAWAII PERMIT FOR DISPLAY OF FIREWORKS</CardTitle>
        <CardDescription>
          Complete this form to apply for a permit for display of fireworks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onSubmit( false ))} className="space-y-8">
            <FormField
              control={form.control}
              name="County"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County<span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={( value ) => field.onChange({ label: value, value })}
                    value={field.value?.value}
                  >
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
                  <FormDescription>
                    Select the county where the activity will take place
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ApplicationDetails.EventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Event</FormLabel><span className="text-red-500">*</span>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys( eventType ).map(( type ) => <SelectItem key={type} value={type}>{eventType[type]}</SelectItem> )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium mb-4">Permittee Details</h3>
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
                  control={form.control}
                  name="ApplicantAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address<span className="text-red-500">*</span></FormLabel>

                      <FormControl>
                        <Textarea placeholder="Enter address" {...field} onBlur={( e ) => {
                          const cleanValue = sanitizeInputValue( e.target.value );
                          field.onChange( cleanValue );
                        }} />
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

            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium mb-4">Person Controlling the Firing</h3>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="ApplicationDetails.IsControllerSameAsPermittee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Same as Permittee</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {!watchControllerSameAsPermittee && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ApplicationDetails.ControllerDetails.ControllerName"
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
                    name="ApplicationDetails.ControllerDetails.ControllerPhoneNumber"
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
                    control={form.control}
                    name="ApplicationDetails.ControllerDetails.ControllerAddress"
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
                    name="ApplicationDetails.ControllerDetails.ControllerAge"
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
              )}
            </Card>

            <Card className="p-6 bg-slate-50">
              <h3 className="text-lg font-medium mb-4">Firing of Fireworks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ApplicationDetails.NameOfDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Display<span className="text-red-500">*</span></FormLabel>

                      <FormControl>
                        <Input placeholder="Enter display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ApplicationDetails.TMK"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TMK#<span className="text-red-500">*</span></FormLabel>

                      <FormControl>
                        <Input placeholder="Enter TMK number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ApplicationDetails.LocationAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Location Address<span className="text-red-500">*</span></FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="Enter location address"
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
                  name="ApplicationDetails.FiringDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firing Date<span className="text-red-500">*</span></FormLabel>

                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={{ before: new Date( new Date().setDate( new Date().getDate() + 1 )) }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ApplicationDetails.FiringTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firing Time<span className="text-red-500">*</span></FormLabel>

                      <div className="relative">
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="Select time"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ApplicationDetails.Quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity<span className="text-red-500">*</span></FormLabel>

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
                  name="ApplicationDetails.FireworksClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fireworks Class<span className="text-red-500">*</span></FormLabel>

                      <FormControl>
                        <Input placeholder="Enter fireworks class" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <div className="flex justify-between">
              {isDraftable && <Button
                className="text-primary"
                type="button"
                variant="ghost"
                disabled={isCreating || isUpdating}
                onClick={() => onSubmit( true )}
              >
                Save as Draft
              </Button>}
              <div className="flex justify-end space-x-4 ms-auto">
                <Button type="button" variant="outline" onClick={() => navigate( urlBuilder( absolutePath ))}>
                  Cancel
                </Button>
                <Button disabled={isCreating || isUpdating} type="submit" >
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
