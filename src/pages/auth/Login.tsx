import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ComposeValidators, RegexValidator, Validate_Required } from "@/utils";
import { login, resetAuthProps } from "@/reduxStore/modules/auth/actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { EAuthActions } from "@/reduxStore/modules/auth/constants";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import BestViewedIn from "@/components/bestViewedIn";

interface ILoginFormFields {
  username: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginStatus, loginErrorMsg } = useAppSelector(( state ) => ({
    loginStatus: state?.auth?.loginStatus,
    loginErrorMsg: state?.auth?.loginErrorMsg
  }));
  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useForm<ILoginFormFields>({ mode: "onChange" });
  const astralAlert = useAstralAlert();
  const signInProcessing = loginStatus === EAuthActions.LOGIN_PROCESSING;

  const onSubmit = ( values: ILoginFormFields ) =>
    dispatch( login( navigate, values.username, values.password, astralAlert ));

  useEffect(
    () => dispatch(
      resetAuthProps({
        loginStatus: EAuthActions.LOGIN_INITIAL,
        loginErrorMsg: undefined
      })
    ),
    [dispatch]
  );

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
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email address or user ID to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or User ID</Label>
                <Input
                  {...register( "username", {
                    validate: ComposeValidators(
                      Validate_Required( t( "auth.login.emailOrUsername" )),
                      ValidateUsername
                    )
                  })}
                  id="email"
                  type="text"
                  placeholder="Enter email or user ID"
                  disabled={signInProcessing}
                  autoComplete="username"
                  required
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  {...register( "password", {
                    validate: Validate_Required( t( "common.words.password" ))
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  disabled={signInProcessing}
                  autoComplete="current-password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!isValid || signInProcessing}>
                {signInProcessing ? "Signing In..." : "Sign In"}
              </Button>
              <div className="flex justify-center">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>
            {loginErrorMsg && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{loginErrorMsg}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="absolute bottom-10">
        <BestViewedIn />
      </div>
    </div>
  );
};

const ValidateUsername = ( value: string ): string | undefined =>
  RegexValidator({ allowChars: "_.\\-@+$\\s", min: 3, max: 100 }, value );

export default Login;
