import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { resendRegistrationCode, resetAuthProps, verifyRegistration } from "@/reduxStore/modules/auth/actions";
import { EAuthActions } from "@/reduxStore/modules/auth/constants";

interface IVerifyAccountFormInputs {
  otp: string;
}

const VerifyAccount = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userName, permanentPaths } = useAppSelector( state => ({
    confirmSignUpStatus: state?.auth?.confirmSignUpStatus,
    confirmSignUpErrorMsg: state?.auth?.confirmSignUpErrorMsg,
    permanentPaths: state?.globalConfig.permanentPaths,
    userName: state?.auth?.destinationUsername,
    confirmTOTPForSignIn: state?.auth?.confirmTOTPForSignIn
  }));
  const { handleSubmit } = useForm<IVerifyAccountFormInputs>({ mode: "onTouched" });

  const onSubmit = ( values: IVerifyAccountFormInputs ) => {
    if ( !userName ){
      return;
    }
    return dispatch( verifyRegistration( userName, values.otp, () => navigate( permanentPaths?.login?.absolutePath )));
  };

  useEffect(() => dispatch( resetAuthProps({ totpSetupStatus: EAuthActions.VERIFY_TOTP_SETUP_INITIAL, confirmSignUpErrorMsg: undefined })), [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <img src="/images/logo.png" alt="PALMS Portal" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-primary">PALMS Portal</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kindly verify your email address</CardTitle>
            <CardDescription>
              Please click on verify your email link sent to your registered email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                onClick={() => navigate( permanentPaths?.login?.absolutePath )}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t get the email?{" "}
              <span onClick={() => {
                if ( userName ) {
                  dispatch( resendRegistrationCode( userName ));
                }
              }} className="text-primary hover:underline cursor-pointer">
                Resend
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyAccount;