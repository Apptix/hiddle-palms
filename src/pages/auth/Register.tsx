import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposeValidators,
  Validate_Email,
  Validate_FullName,
  Validate_Password,
  Validate_Required,
  Validate_UserName_Pattern
} from "@/utils/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetAuthProps, register as signUp } from "@/reduxStore/modules/auth/actions";
import { useAppDispatch, useAppSelector } from "@/hooks/index";
import { EAuthActions } from "@/reduxStore/modules/auth/constants";
interface IRegisterFormInputs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { registerStatus, registerErrorMsg, permanentPaths } = useAppSelector( state => ({
    registerStatus: state?.auth?.signUpStatus,
    registerErrorMsg: state?.auth?.registrationErrorMsg,
    permanentPaths: state?.globalConfig?.permanentPaths
  }));

  const { handleSubmit, register, formState: { errors } } = useForm<IRegisterFormInputs>({ mode: "onTouched" });

  const signUpProcessing = registerStatus === EAuthActions.SIGN_UP_PROCESSING;

  const onSubmit = ( values: IRegisterFormInputs ): void => {
    return dispatch( signUp( navigate, values.username, values.password, values.firstName, values.lastName, values.email ));
  };

  useEffect(() => dispatch( resetAuthProps({ signUpStatus: EAuthActions.SIGN_UP_INITIAL, registrationErrorMsg: undefined })), [dispatch]);

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
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Register to apply for permits and licenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
              {registerErrorMsg && (
                <div className="flex items-center gap-2 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle size={16} />
                  <p>{registerErrorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register( "firstName", {
                      validate: ComposeValidators( Validate_Required( t( "auth.firstName" )), Validate_FullName )
                    })}
                    placeholder="John"
                    disabled={signUpProcessing}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register( "lastName", {
                      validate: ComposeValidators( Validate_Required( t( "auth.lastName" )), Validate_FullName )
                    })}
                    placeholder="Doe"
                    disabled={signUpProcessing}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register( "email", {
                    validate: ComposeValidators( Validate_Required( t( "common.words.email" )), Validate_Email )
                  })}
                  type="email"
                  placeholder="john.doe@example.com"
                  disabled={signUpProcessing}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">User ID</Label>
                <Input
                  id="username"
                  {...register( "username", {
                    validate: ComposeValidators( Validate_Required( t( "common.words.username" )), Validate_UserName_Pattern )
                  })}
                  placeholder="johnD123"
                  disabled={signUpProcessing}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Choose a unique user ID to use for login
                </p>
              </div>

              <div className="space-y-2">

                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  {...register( "password", {
                    validate: ComposeValidators( Validate_Required( t( "common.words.password" )), Validate_Password )
                  })}
                  type="password"
                  placeholder="••••••••"
                  disabled={signUpProcessing}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t( "profile.passwordValidation.helperText" )}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                {signUpProcessing ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to={permanentPaths?.login?.absolutePath} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
