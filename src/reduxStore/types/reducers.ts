// Libraries
import { PersistPartial } from "redux-persist/es/persistReducer";

// Methods / Hooks / Constants / Styles
import type { IListingPreferences } from "@/types/index";
import type {
  TAccountState,
  TAuthState,
  TGlobalConfigState,
  TNotificationsState,
  IGlobalFormManagerState,
  TApplication
} from "../modules/types";
import customizationsBaseApi from "../services/customizationsBaseApi";
import baseApi from "../services/baseApi";

export interface IRootState {
  auth: TAuthState & PersistPartial;
  account: TAccountState;
  application: TApplication;
  globalConfig: TGlobalConfigState;
  notifications: TNotificationsState;
  globalFormManager: IGlobalFormManagerState;
  baseApi: ReturnType<typeof baseApi.reducer>;
  customizationsBaseApi: ReturnType<typeof customizationsBaseApi.reducer>;
  listingPreferences: Record<string, IListingPreferences>,
}

