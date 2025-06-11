// Libraries
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Methods / Hooks / Constants / Styles
import auth from "./modules/auth/slice";
import globalConfig from "./modules/globalConfig/slice";
import account from "./modules/account/slice";
import baseApi from "./services/baseApi";
import customizationsBaseApi from "./services/customizationsBaseApi";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  blacklist: [
    "loginErrorMsg",
    "forgotPwdSubmitErrorMsg",
    "forgotPwdErrorMsg",
    "forgotPwdResendCodeStatus",
    "forgotPwdResendCodeErrorMsg",
    "registrationErrorMsg",
    "loginStatus",
    "signUpStatus",
    "verifyTotpTokenErrorMsg",
    "confirmSignInStatus",
    "confirmSignUpStatus",
    "forgotPwdStatus",
    "forgotPwdSubmitStatus",
    "confirmSignUpErrorMsg",
    "resendSignUpErrorMsg",
    "registrationResendCodeStatus",
    "totpSetupStatus",
    "totpSetupErrorMsg",
    "verifyTotpSetupStatus",
    "verifyTotpSetupErrorMsg"
  ]
};

export default {
  auth: persistReducer( authPersistConfig, auth ),
  account,
  globalConfig,
  [baseApi.reducerPath]: baseApi.reducer,
  [customizationsBaseApi.reducerPath]: customizationsBaseApi.reducer
};