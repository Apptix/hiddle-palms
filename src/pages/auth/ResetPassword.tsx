import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAstralAlert } from "@/hooks/useAstralAlert";
import { EAuthActions } from "@/reduxStore/modules/auth/constants";
import { forcePasswordReset, logout, resetAuthProps } from "@/reduxStore/modules/auth/actions";
import { useAppDispatch, useAppSelector } from "@/hooks";

const ResetPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const astralAlert = useAstralAlert();
  const { tempPwd, permanentPaths, resetPwdStatus, resetPwdErrorMsg, username } = useAppSelector( state => ({
    tempPwd: state?.auth?.tempPwd,
    permanentPaths: state?.globalConfig.permanentPaths,
    resetPwdStatus: state?.auth?.forcePwdResetStatus,
    resetPwdErrorMsg: state?.auth?.forcePwdResetErrorMsg,
    username: state?.auth?.username
  }));

  const { watch, handleSubmit, register, formState: { errors, isValid } } = useForm({ mode: "onTouched" });
  const resetPwdProcessing = EAuthActions.FORCE_PWD_RESET_PROCESSING === resetPwdStatus;

  const onSubmit = ( values: any ) => {
    if ( !tempPwd ) {
      return;
    }
    return dispatch( forcePasswordReset( values.password, { username, tempPwd }));
  };

  useEffect(() => dispatch( resetAuthProps({ forcePwdResetStatus: EAuthActions.FORCE_PWD_RESET_INITIAL, forcePwdResetErrorMsg: undefined })), [dispatch]);

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
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetPwdStatus === "FORCE_PWD_RESET_SUCCESS" ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-center text-muted-foreground">{t( "en:auth.resetPassword.pwdChangedSuccessfully" )}</p>
                <Button
                  className="w-full"
                  onClick={() => dispatch( logout( navigate, undefined, true, astralAlert ))}
                >
                  {t( "en:common.words.backToLogin" )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
                {resetPwdErrorMsg && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{resetPwdErrorMsg}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="**********"
                      {...register( "password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: t( "profile.passwordValidation.minLength" )
                        },
                        pattern: {
                          value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
                          message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                        }
                      })}
                    />
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors?.password?.message}</p>
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
                        validate: value => value === watch( "password" ) || "Passwords do not match"
                      })}
                    />
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors?.confirmPassword?.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isValid || resetPwdProcessing}
                >
                  {resetPwdProcessing ? "Resetting..." : t( "en:auth.resetPassword.resetPassword" )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to={permanentPaths?.login?.absolutePath} className="text-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;