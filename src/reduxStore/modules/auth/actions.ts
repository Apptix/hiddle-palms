
import {
  appendRedirectUrl,
  getRedirectUrl
} from "@/utils/index";

// Libraries
import { Auth } from "aws-amplify";
import { Dispatch } from "redux";
import { EAuthActions } from "./constants";
import type { TAppThunk } from "@/types/index";
import baseApi from "../../services/baseApi";
import { logoutAction } from "../common/actions";
import { mfaType } from "@/constants/index";
import { updateAccount } from "../account/slice";
// methods / hooks / constants / styles
import { updateAuth } from "./slice";

export const validateSession = (): TAppThunk =>
  async ( dispatch: Dispatch<any> ): Promise<any> => {
    try {
      const session = await Auth?.currentSession();
      dispatch( updateAuth({
        idToken: session?.getIdToken()?.getJwtToken(),
        validSession: session?.isValid() ?? false
      }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( err ) {
      dispatch( updateAuth({
        validSession: false
      }));
    }
  };

export const login = ( navigate: any, username: string, password: string, astralAlert ): TAppThunk =>
  async ( dispatch: Dispatch<any>, getState ): Promise<any> => {

    const { auth: { loginErrorMsg }, globalConfig: { permanentPaths, enforceMFA } } = getState();

    const qpURL = getRedirectUrl();

    try {
      dispatch( updateAuth({
        loginStatus: EAuthActions.LOGIN_PROCESSING,
        loginErrorMsg: undefined
      }));
      const user = await Auth?.signIn( username, password );

      if ( user.challengeName === "NEW_PASSWORD_REQUIRED" ) {
        dispatch( updateAuth({
          tempPwd: password,
          username: user?.username ?? username
        }));
        navigate( appendRedirectUrl( permanentPaths?.resetPassword?.absolutePath, qpURL ));
        return;
      } else if ( user.challengeName === "MFA_SETUP" ) {
        navigate( appendRedirectUrl( permanentPaths?.setupTOTP?.absolutePath, qpURL ));
        return;
      } else if ( user.challengeName === "SOFTWARE_TOKEN_MFA" ) {
        dispatch( updateAuth({
          mfaEnabled: true,
          confirmTOTPForSignIn: true,
          username: user?.username ?? username
        }));
        navigate( appendRedirectUrl( permanentPaths?.verify?.absolutePath, qpURL ));
        return;
      } else if ( loginErrorMsg === "User is not confirmed." ) {
        navigate( appendRedirectUrl( permanentPaths?.verify?.absolutePath, qpURL ));
        return;
      }

      const preferredMFAType = await Auth.getPreferredMFA( user );
      if ( preferredMFAType === "NOMFA" && enforceMFA === mfaType.mandatory ) {
        dispatch( updateAuth({ username: user?.username ?? username }));
        navigate( appendRedirectUrl( permanentPaths?.setupTOTP?.absolutePath, qpURL ));
        return;
      }
      dispatch( updateAuth({
        idToken: user?.signInUserSession?.idToken?.jwtToken,
        loginStatus: EAuthActions.LOGIN_SUCCESS,
        sessionActive: true,
        validSession: true,
        username: user?.username ?? username
      }));
      dispatch( updateAccount({ username: user?.username ?? username }));
      astralAlert.success({
        title: "Login successful!",
        description: "Welcome to the PALMS Portal."
      });
      navigate( appendRedirectUrl( permanentPaths?.root?.absolutePath, qpURL ));
    } catch ( error ) {
      if (( error as Error ).message === "User is not confirmed." ) {
        dispatch( resendRegistrationCode( username ));
        navigate( appendRedirectUrl( permanentPaths?.verify?.absolutePath, qpURL ));
      }
      dispatch( updateAuth({
        loginErrorMsg: ( error as Error )?.message || JSON.stringify( error ),
        loginStatus: EAuthActions.LOGIN_FAILURE
      }));
    }
  };

export const register = ( navigate: any, username: string, password: string, firstName: string, lastName: string, email: string ): TAppThunk =>
  async ( dispatch, getState ) => {
    const redirectURL = getRedirectUrl();
    try {
      dispatch( updateAuth({
        signUpStatus: EAuthActions.SIGN_UP_PROCESSING,
        registrationErrorMsg: undefined,
        destinationEmail: undefined
      }));

      const { user, codeDeliveryDetails }: Record<string, any> = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName
        }
      });

      dispatch( updateAuth({
        destinationUsername: user?.username,
        destinationEmail: codeDeliveryDetails?.Destination,
        signUpStatus: EAuthActions.SIGN_UP_SUCCESS,
        confirmTOTPForSignIn: undefined
      }));

      const { permanentPaths } = getState().globalConfig;
      navigate( appendRedirectUrl( permanentPaths?.verify?.absolutePath, redirectURL ));

    } catch ( error ) {
      dispatch( updateAuth({
        registrationErrorMsg: ( error as Error )?.message || JSON.stringify( error ),
        signUpStatus: EAuthActions.SIGN_UP_FAILURE,
        destinationEmail: undefined
      }));
    }
  };

export const verifyRegistration = ( username: string, code: string, restart: () => void ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        confirmSignUpErrorMsg: undefined,
        confirmSignUpStatus: EAuthActions.CONFIRM_SIGN_UP_PROCESSING,
        registrationResendCodeStatus: EAuthActions.RESEND_INITIAL
      }
      ));
      await Auth.confirmSignUp( username, code );
      dispatch( updateAuth({
        destinationUsername: undefined,
        destinationEmail: undefined,
        confirmSignUpStatus: EAuthActions.CONFIRM_SIGN_UP_SUCCESS
      }));
      restart();
    } catch ( error ) {
      dispatch( updateAuth({
        confirmSignUpErrorMsg: ( error as Error )?.message || JSON.stringify( error ),
        confirmSignUpStatus: EAuthActions.CONFIRM_SIGN_UP_FAILURE
      }));
    }
  };

export const resendRegistrationCode = ( username: string ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        resendSignUpErrorMsg: undefined,
        confirmSignUpErrorMsg: undefined,
        registrationResendCodeStatus: EAuthActions.RESEND_PROCESSING
      }));

      await Auth.resendSignUp( username );

      dispatch( updateAuth({
        registrationResendCodeStatus: EAuthActions.RESEND_SUCCESS
      }));

    } catch ( error ) {
      dispatch( updateAuth({
        resendSignUpErrorMsg: ( error as Error )?.message,
        registrationResendCodeStatus: EAuthActions.RESEND_FAILURE
      }));
    }
  };

export const forcePasswordReset = ( newPassword: string, auth: any ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        forcePwdResetStatus: EAuthActions.FORCE_PWD_RESET_PROCESSING
      }));
      await Auth.signIn( auth.username, auth.tempPwd ).then(( user ) => {
        Auth.completeNewPassword(
          user,
          newPassword
        ).then(() => {
          dispatch( updateAuth({
            forcePwdResetStatus: EAuthActions.FORCE_PWD_RESET_SUCCESS
          }));
        }).catch( error => {
          dispatch( updateAuth({
            forcePwdResetErrorMsg: ( error as Error )?.message,
            forcePwdResetStatus: EAuthActions.FORCE_PWD_RESET_FAILURE
          }));
        });
      });
    } catch ( error ) {
      dispatch( updateAuth({
        forcePwdResetErrorMsg: ( error as Error )?.message,
        forcePwdResetStatus: EAuthActions.FORCE_PWD_RESET_FAILURE
      }));
    }
  };

export const forgotPassword = ( username: string ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        forgotPwdErrorMsg: undefined,
        forgotPwdStatus: EAuthActions.FORGOT_PWD_PROCESSING
      }));
      // Send confirmation code to user's email
      await Auth.forgotPassword( username );

      dispatch( updateAuth({
        forgotPwdStatus: EAuthActions.FORGOT_PWD_SUCCESS,
        forgotPwdSubmitStatus: undefined,
        forgotPwdSubmitErrorMsg: undefined
      }));
    } catch ( error ) {
      dispatch( updateAuth({
        forgotPwdErrorMsg: ( error as Error )?.message,
        forgotPwdStatus: EAuthActions.FORGOT_PWD_FAILURE
      }));
    }
  };

export const forgotPasswordResendCode = ( username: string, astralAlert ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        forgotPwdSubmitErrorMsg: undefined,
        forgotPwdResendCodeErrorMsg: undefined,
        forgotPwdResendCodeStatus: EAuthActions.FORGOT_PWD_RESEND_CODE_PROCESSING
      }));
      // Resend confirmation code to user's email
      await Auth.forgotPassword( username );
      dispatch( updateAuth({
        forgotPwdResendCodeStatus: EAuthActions.FORGOT_PWD_RESEND_CODE_SUCCESS
      }));
      astralAlert.success({
        title: "OTP sent successfully!"
      });
    } catch ( error ) {
      dispatch( updateAuth({
        forgotPwdResendCodeErrorMsg: ( error as Error ).message,
        forgotPwdResendCodeStatus: EAuthActions.FORGOT_PWD_RESEND_CODE_FAILURE
      }));
    }
  };

export const confirmPassword = ( username: string, verificationCode: string, newPassword: string, restart: () => void ): TAppThunk =>
  async ( dispatch ) => {
    try {
      dispatch( updateAuth({
        forgotPwdSubmitErrorMsg: null,
        forgotPwdSubmitStatus: EAuthActions.FORGOT_PWD_SUBMIT_PROCESSING
      }));
      // Collect confirmation code and new password, then
      await Auth.forgotPasswordSubmit( username, verificationCode, newPassword );
      dispatch( updateAuth({ forgotPwdSubmitStatus: EAuthActions.FORGOT_PWD_SUBMIT_SUCCESS }));
      restart();
    } catch ( error: any ) {
      dispatch( updateAuth({
        forgotPwdSubmitErrorMsg: error?.message || JSON.stringify( error ),
        forgotPwdSubmitStatus: EAuthActions.FORGOT_PWD_SUBMIT_FAILURE
      }));
    }
  };

// to keep all related actions in one place, max-lines per file is disabled for this file

export const changePassword = ( oldPassword: string, newPassword: string, navigate: any, callback: ( info: any ) => void ): TAppThunk => {
  return async ( dispatch ): Promise<any> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const passwordChangeRes = await Auth.changePassword( user, oldPassword, newPassword );
      if ( passwordChangeRes === "SUCCESS" ) {
        dispatch( logout( navigate, true ));
      }
      callback({ success: true });
    } catch ( err: any ) {
      console.error( "Failed to change the password" );
      callback({ success: false, error: err });
    }
  };
};

export const logout = ( navigate?: any, globalLogout = false, retainRedirectUrl = false, astralAlert?: any ): TAppThunk =>
  async ( dispatch, getState ) => {
    try {
      Auth.signOut({ global: globalLogout });
      dispatch( logoutAction());
      dispatch( baseApi?.util?.resetApiState());
      astralAlert?.success({
        title: "Logged out successfully!"
      });
    } finally {
      const redirectURL = getRedirectUrl();
      const { permanentPaths } = getState()?.globalConfig ?? {};
      if ( navigate ) {
        navigate?.( retainRedirectUrl ? appendRedirectUrl( permanentPaths?.login?.absolutePath, redirectURL )
          : permanentPaths?.login?.absolutePath );
      } else {
        window.location.replace( retainRedirectUrl ? appendRedirectUrl( permanentPaths?.login?.absolutePath, redirectURL )
          : permanentPaths?.login?.absolutePath ?? "/" );
      }
    }
  };

export const updateAuthReducer = ( data: Record<string, any> ): TAppThunk => ( dispatch ) => {
  dispatch( updateAuth( data ));
};

export const resetAuthProps = ( propsToReset: Record<string, unknown | never> ): TAppThunk => {
  return ( dispatch ) => {
    dispatch( updateAuth( propsToReset ));
  };
};
