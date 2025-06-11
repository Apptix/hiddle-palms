// Libraries
import { createSlice } from "@reduxjs/toolkit";

// Methods / Hooks / Constants / Styles
import { logoutAction } from "../common/actions.ts";
import type { TAuthState } from "../types/auth";
import { EAuthActions } from "./constants.ts";

const initialState: TAuthState = {
  mfaEnabled: false,
  verifyingCode: false,
  registrationResendCodeStatus: EAuthActions.RESEND_INITIAL,
  confirmSignInStatus: EAuthActions.CONFIRM_SIGN_IN_INITIAL,
  confirmSignUpStatus: EAuthActions.CONFIRM_SIGN_UP_INITIAL,
  forgotPwdStatus: EAuthActions.FORGOT_PWD_INITIAL,
  forgotPwdSubmitStatus: EAuthActions?.FORGOT_PWD_SUBMIT_INITIAL,
  forgotPwdResendCodeStatus: EAuthActions?.FORGOT_PWD_RESEND_CODE_INITIAL,
  loginStatus: EAuthActions?.LOGIN_INITIAL,
  signUpStatus: EAuthActions?.SIGN_UP_INITIAL,
  totpSetupStatus: EAuthActions?.TOTP_SETUP_INITIAL,
  verifyTotpSetupStatus: EAuthActions?.VERIFY_TOTP_SETUP_INITIAL,
  idToken: "",
  sessionActive: false,
  validSession: false,
  username: undefined,
  Email: undefined,
  mfaError: "",
  fetchingMfa: false
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth( state, action ) {
      Object.assign( state, action.payload );
    } },
  extraReducers: ( builder ) => {
    builder.addMatcher(
      action => logoutAction.match( action ),
      ( state ) => {
        state = initialState;
        return state;
      }
    );
  }
});

const { reducer } = auth;
export const { updateAuth } = auth.actions;
export default reducer;