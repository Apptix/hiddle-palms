import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { REGEX_FULL_NAME, ValidatePhoneNumber, counties, roles } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/pageHeader";

import { ComposeValidators, Validate_ConfirmPassword, Validate_Password, Validate_Required, capitalize } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { changePassword } from "@/reduxStore/modules/auth/actions";
import { loadUserAccount } from "@/reduxStore/modules/account/actions";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { useUpdateUserMutation } from "@/reduxStore/services/user";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [updateUser] = useUpdateUserMutation();
  const [ loading, setLoading ] = useState( false );
  const astralAlert = useAstralAlert();
  const { account, username } = useAppSelector(({ account: acc, auth }) => ({
    username: auth?.username,
    account: acc
  }));

  const { FirstName = "", LastName = "", PhoneNumber = "", EmailId = "", Address = "", County = "", UserId = "" } = account;

  // Profile form
  const { control, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      firstName: FirstName,
      lastName: LastName,
      address: Address,
      phoneNumber: PhoneNumber,
      county: County,
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // Password form
  const { register, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch, reset: resetPassword } = useForm();

  const handleProfileUpdate = async ( values: any ) => {
    setLoading( true );
    if ( REGEX_FULL_NAME( values?.firstName ) || REGEX_FULL_NAME( values?.lastName )) {
      try {
        const { Message } = await updateUser({
          requestBody: {
            FirstName: values?.firstName,
            LastName: values?.lastName,
            Address: values?.address,
            PhoneNumber: values?.phoneNumber,
            County: values?.county
          },
          userId: username
        }).unwrap();
        if ( Message ) {
          astralAlert.success({
            title: Message
          });
          if ( username ) {
            dispatch( loadUserAccount( username, false, true ));
          }
        }
      } finally {
        setLoading( false );
      }
    } else {
      astralAlert.error({
        title: "Error",
        description: "Please try again in sometime."
      });
      setLoading( false );
    }
  };

  const handlePasswordChange = async ( values: any ) => {
    setLoading( true );
    const { oldPassword, newPassword } = values;
    dispatch( changePassword( oldPassword, newPassword, navigate, ( info: any ) => {
      setLoading( false );
      if ( info?.success ) {
        astralAlert.success({
          title: "Password changed successfully"
        });
      } else {
        astralAlert.error({
          title: "Error",
          description: info?.error?.message ?? "Please try again in sometime."
        });
      }
    }));
    resetPassword();
  };

  return (
    <div className="container py-10 px-0 mx-0">
      <PageHeader
        heading={t( "profile.heading" )}
        subHeading={t( "profile.subHeading" )}
      />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage alt={FirstName} />
                  <AvatarFallback className="text-primary font-bold text-lg">
                    {FirstName?.charAt( 0 )?.toUpperCase()}
                    {LastName?.charAt( 0 )?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{capitalize( FirstName )} {capitalize( LastName )}</h2>
                <p className="text-muted-foreground">{EmailId}</p>
                <p className="text-muted-foreground">User ID: {UserId}</p>
                <p className="text-sm mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {capitalize( account?.CurrentRole || "" )}
                </p>
              </div>
            </CardContent>
          </Card>
          {
            account?.RoleId === roles.inspector && !account?.County && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-red-500">You need to update the county before you can access applications.</p>
                </CardContent>
              </Card>
            )
          }
        </div>

        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">{t( "profile.profileSettings" )}</TabsTrigger>
              <TabsTrigger value="security">{t( "profile.password" )}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-0">
              <Card className="p-0">
                <CardHeader>
                  <CardTitle>{t( "profile.profileSettings" )}</CardTitle>
                  <CardDescription>
                    {t( "profile.profileSettingsSubtext" )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit( handleProfileUpdate )} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t( "profile.firstName" )}</Label>
                        <Controller
                          name="firstName"
                          control={control}
                          rules={{ validate: ( val ) => Validate_Required( t( "profile.firstName" ))( val ) }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="firstName"
                              disabled={loading}
                            />
                          )}
                        />
                        {profileErrors.firstName && (
                          <p className="text-sm text-destructive">{profileErrors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t( "profile.lastName" )}</Label>
                        <Controller
                          name="lastName"
                          control={control}
                          rules={{ validate: ( val ) => Validate_Required( t( "profile.lastName" ))( val ) }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="lastName"
                              disabled={loading}
                            />
                          )}
                        />
                        {profileErrors.lastName && (
                          <p className="text-sm text-destructive">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t( "profile.emailId" )}</Label>
                      <Input
                        id="email"
                        value={EmailId}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t( "profile.phoneNumber" )}</Label>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ validate: ( val ) => Validate_Required( t( "profile.phoneNumber" ))( val ) }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phoneNumber"
                            disabled={loading}
                            placeholder="E.g: (808) 555-1234"
                            onChange={( e ) => ValidatePhoneNumber( e, field )}
                            // {...getFieldErrorProps( profileErrors, "phoneNumber" )}
                          />
                        )}
                      />
                      {profileErrors.phoneNumber && (
                        <p className="text-sm text-destructive">{profileErrors.phoneNumber.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="county">{t( "profile.county" )}</Label>
                      <Controller
                        name="county"
                        control={control}
                        rules={{ validate: ( val ) => Validate_Required( t( "profile.county" ))( val ) }}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="county"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            disabled={loading || ( account?.County && account?.RoleId === "inspector" )}
                            // {...getFieldErrorProps( profileErrors, "county" )}
                          >
                            <option value="">Select County</option>
                            {Object.entries( counties ).map(([ key, value ]) => (
                              <option key={key} value={value.toLowerCase()}>{value}</option>
                            ))}
                          </select>
                        )}
                      />
                      {profileErrors.county && (
                        <p className="text-sm text-destructive">{profileErrors.county.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t( "profile.address" )}</Label>
                      <Controller
                        name="address"
                        control={control}
                        rules={{ validate: ( val ) => Validate_Required( t( "profile.address" ))( val ) }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="address"
                            disabled={loading}
                          />
                        )}
                      />
                      {profileErrors.address && (
                        <p className="text-sm text-destructive">{profileErrors.address.message}</p>
                      )}
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? t( "common.button.updating" ) : t( "common.button.update" )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t( "profile.changeAccountPassword" )}</CardTitle>
                  <CardDescription>
                    {t( "profile.pwdManagementSubtext" )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit( handlePasswordChange )} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">{t( "profile.oldPassword" )}</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        {...register( "oldPassword", {
                          validate: Validate_Required( t( "profile.oldPassword" ))
                        })}
                        autoComplete="current-password"
                        // {...getFieldErrorProps( passwordErrors, "oldPassword" )}
                      />
                      {passwordErrors.oldPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.oldPassword.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t( "profile.newPassword" )}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...register( "newPassword", {
                          validate: ComposeValidators( Validate_Required( t( "profile.password" )), Validate_Password )
                        })}
                        autoComplete="new-password"

                      />
                      <p className="text-xs text-muted-foreground">
                        {t( "profile.passwordValidation.helperText" )}
                      </p>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t( "profile.confirmPassword" )}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register( "confirmPassword", {
                          validate: ComposeValidators(
                            Validate_Required( t( "profile.confirmPassword" )),
                            Validate_ConfirmPassword( watch( "newPassword" ))
                          )
                        })}
                        autoComplete="new-password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? t( "common.button.submitting" ) : t( "common.button.submit" )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
