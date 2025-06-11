export type TAuthState = {
  mfaEnabled: boolean;
  verifyingCode: boolean;
  registrationResendCodeStatus: EAuthActions;
  confirmSignInStatus: EAuthActions;
  confirmSignUpStatus: EAuthActions;
  forgotPwdStatus: EAuthActions;
  forgotPwdSubmitStatus: EAuthActions;
  forgotPwdResendCodeStatus: EAuthActions;
  forgotPwdErrorMsg?: string;
  forgotPwdSubmitErrorMsg?: string;
  forgotPwdResendCodeErrorMsg?: string;
  loginStatus: EAuthActions;
  signUpStatus: EAuthActions;
  totpSetupStatus: EAuthActions;
  verifyTotpSetupStatus: EAuthActions;
  idToken: string;
  loginErrorMsg?: string;
  registrationErrorMsg?: string;
  destinationUsername?: string;
  confirmSignUpErrorMsg?: string;
  sessionActive: boolean;
  validSession: boolean;
  forcePwdResetStatus?: authActions;
  forcePwdResetErrorMsg?: string;
  tempPwd?: string;
  verifyTotpTokenErrorMsg?: authActions;
  username?: string;
  Email?: string;
  confirmTOTPForSignIn?: authActions;
  totpSetupErrorMsg?: string;
  verifyTotpSetupErrorMsg?: string;
  secretCode?: string;
  mfaError:string,
  fetchingMfa: false
};