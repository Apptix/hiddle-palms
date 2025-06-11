import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otpInput";

import { EAuthActions } from "@/reduxStore/modules/auth/constants";
import { REGEX_VALID_EMAIL } from "@/constants";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ComposeValidators, Validate_Password, Validate_Required } from "@/utils";
import { confirmPassword, forgotPassword, forgotPasswordResendCode, resetAuthProps } from "@/reduxStore/modules/auth/actions";

interface IForgotPasswordFormFields {
  username: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { handleSubmit, register, watch, reset, setValue, unregister, formState: { errors } } = useForm<IForgotPasswordFormFields>({ mode: "onTouched" });
  const {
    forgotPwdStatus,
    forgotPwdErrorMsg,
    forgotPwdSubmitStatus,
    forgotPwdSubmitErrorMsg,
    forgotPwdResendCodeStatus,
    forgotPwdResendCodeErrorMsg } = useAppSelector(({ auth }) => auth );
  const { permanentPaths } = useAppSelector( state => state.globalConfig );
  const usernameValue = watch( "username" );
  const astralAlert = useAstralAlert();

  const onSubmit = ( values: IForgotPasswordFormFields ) => {
    const resetForm = () => reset({});
    const { username, verificationCode, newPassword } = values;
    if ( forgotPwdStatus === EAuthActions.FORGOT_PWD_SUCCESS ) {
      dispatch( confirmPassword( username, verificationCode, newPassword, resetForm ));
    } else {
      dispatch( forgotPassword( username ));
    }
  };

  const resendCode = ( username: string ) => {
    dispatch( forgotPasswordResendCode( username, astralAlert ));
  };

  const resetForgotPage = useCallback(() => {
    dispatch( resetAuthProps({
      forgotPwdStatus: EAuthActions.FORGOT_PWD_INITIAL,
      forgotPwdSubmitStatus: EAuthActions.FORGOT_PWD_SUBMIT_INITIAL,
      forgotPwdSubmitErrorMsg: undefined
    }));
  }, [dispatch]);

  useEffect(() => dispatch( resetAuthProps({
    forgotPwdStatus: EAuthActions.FORGOT_PWD_INITIAL,
    forgotPwdSubmitStatus: EAuthActions.FORGOT_PWD_SUBMIT_INITIAL,
    forgotPwdSubmitErrorMsg: undefined,
    forgotPwdErrorMsg: undefined
  })), [dispatch]);

  useEffect(() => {
    if ( forgotPwdStatus === EAuthActions.FORGOT_PWD_INITIAL ) {
      unregister( "verificationCode" );
    }
  }, [ forgotPwdStatus, unregister ]);

  useEffect(() => {
    if ( forgotPwdResendCodeErrorMsg ) {
      const timer = setTimeout(() => {
        dispatch(
          resetAuthProps({
            forgotPwdResendCodeErrorMsg: undefined
          })
        );
      }, 3000 );

      return () => clearTimeout( timer );
    }
  }, [ forgotPwdResendCodeErrorMsg, dispatch ]);

  useEffect(() => {
    if ( forgotPwdResendCodeStatus === EAuthActions.FORGOT_PWD_RESEND_CODE_SUCCESS ) {
      const timer = setTimeout(() => {
        dispatch(
          resetAuthProps({
            forgotPwdResendCodeStatus: EAuthActions.FORGOT_PWD_RESEND_CODE_INITIAL
          })
        );
      }, 3000 );
      return () => clearTimeout( timer );
    }
  }, [ forgotPwdResendCodeStatus, dispatch ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="PALMS Portal" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-primary">PALMS Portal</h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
              {forgotPwdStatus === EAuthActions.FORGOT_PWD_SUCCESS ? (
                <div className="space-y-4">
                  {forgotPwdSubmitStatus !== EAuthActions.FORGOT_PWD_SUBMIT_SUCCESS && (
                    <>
                      <div>
                        <h1 className="text-xl font-semibold mb-2">{t( "auth.changePwd.heading" )}</h1>
                        <p className="text-sm text-muted-foreground">
                          {REGEX_VALID_EMAIL.test( usernameValue )
                            ? t( "auth.changePwd.sentToEmail", undefined, { username: usernameValue })
                            : t( "auth.changePwd.sentToUsername", undefined, { username: usernameValue })}
                          <Button
                            variant="link"
                            className="inline-flex p-0 h-auto"
                            onClick={resetForgotPage}
                          >
                            {t( "auth.forgotPwd.changeUsername" )}
                          </Button>
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="verificationCode">Verification Code</Label>
                          <OTPInput
                            value={watch( "verificationCode" ) || ""}
                            onChange={( val ) => setValue( "verificationCode", val )}
                            disabled={forgotPwdSubmitStatus === EAuthActions.FORGOT_PWD_SUBMIT_PROCESSING}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{t( "auth.verify.didNotReceiveEmail" )}</p>
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => resendCode( usernameValue )}
                            disabled={forgotPwdResendCodeStatus === EAuthActions.FORGOT_PWD_RESEND_CODE_PROCESSING}
                          >
                            {t( "auth.verify.resend" )}
                          </Button>
                        </div>

                        {forgotPwdResendCodeStatus === EAuthActions.FORGOT_PWD_RESEND_CODE_SUCCESS && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <p className="text-sm">{t( "auth.verify.resendSuccess" )}</p>
                          </div>
                        )}

                        {forgotPwdResendCodeErrorMsg && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-sm">{forgotPwdResendCodeErrorMsg}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h1 className="text-xl font-semibold">{t( "auth.forgotPwd.changePassword" )}</h1>
                        <p className="text-sm text-muted-foreground">{t( "auth.forgotPwd.chngPwdMessage" )}</p>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type="password"
                              placeholder="**********"
                              {...register( "newPassword", {
                                required: "Password is required",
                                validate: ComposeValidators( Validate_Required( t( "common.words.password" )), Validate_Password )
                              })}
                            />
                          </div>
                          {errors.newPassword && (
                            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="**********"
                              {...register( "confirmPassword", {
                                required: "Confirm password is required",
                                validate: value => value === watch( "newPassword" ) || "Passwords do not match"
                              })}
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t( "profile.passwordValidation.helperText" )}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={forgotPwdSubmitStatus === EAuthActions.FORGOT_PWD_SUBMIT_PROCESSING}
                      >
                        {forgotPwdSubmitStatus === EAuthActions.FORGOT_PWD_SUBMIT_PROCESSING
                          ? "Submitting..."
                          : t( "common.button.submit" )}
                      </Button>

                      {forgotPwdSubmitErrorMsg && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{forgotPwdSubmitErrorMsg}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}

                  {forgotPwdSubmitStatus === EAuthActions.FORGOT_PWD_SUBMIT_SUCCESS && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                      <p className="text-center text-muted-foreground">{t( "auth.forgotPwd.pwdChangeSuccessMsg" )}</p>
                      {forgotPwdResendCodeErrorMsg && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{forgotPwdResendCodeErrorMsg}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-semibold">{t( "auth.forgotPwd.heading" )}</h1>
                  <p className="text-sm text-muted-foreground">{t( "auth.forgotPwd.message" )}</p>

                  <div className="space-y-2">
                    <Label htmlFor="username">Email or Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="user@domain.com"
                        disabled={forgotPwdStatus === EAuthActions.FORGOT_PWD_PROCESSING}
                        {...register( "username" )}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      forgotPwdStatus === EAuthActions.FORGOT_PWD_PROCESSING ||
                      !usernameValue
                    }
                  >
                    {forgotPwdStatus === EAuthActions.FORGOT_PWD_PROCESSING
                      ? "Sending..."
                      : t( "auth.forgotPwd.sendEmail" )}
                  </Button>

                  {forgotPwdErrorMsg && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{forgotPwdErrorMsg}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {/* <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/auth/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p> */}

              {forgotPwdStatus === EAuthActions.FORGOT_PWD_SUCCESS &&
                forgotPwdSubmitStatus !== EAuthActions.FORGOT_PWD_SUBMIT_SUCCESS && (
                <p className="text-sm text-muted-foreground">
                  {t( "common.messages.ifYouEncounterAnyIssue" )}
                  <span className="font-medium">support@amorphic.com</span>
                </p>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to={permanentPaths?.login?.absolutePath} className="text-sm text-primary hover:underline">
              {t( "auth.backToLogin" )}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;