// libraries
import { createSlice } from "@reduxjs/toolkit";

// methods / hooks / constants / styles
import permanentPaths from "@/configs/permanentPaths.json";
import { getAllRoutes, isTruthyValue } from "@/utils/index";
import type { TGlobalConfigState } from "../types/globalConfig";
import { serviceLevelPermission } from "@/constants/index";

const GlobalConfigInitialState: TGlobalConfigState = {
  permanentPaths: {},
  TARGET_LOCATION: [],
  FILE_TYPES: [],
  enforceMFA: "OPTIONAL",
  drModeAcknowledged: false,
  isDRMode: false,
  PROJECT_SHORT_NAME: "",
  PROJECT_NAME: "",
  VERSION: "",
  FEEDBACK_ADDRESS: "",
  ENVIRONMENT: "",
  ENABLE_COSTMGMT: "no",
  ENABLE_HCLS: "no",
  ENABLED_HCLS_LIST: "",
  ENABLE_ES: "no",
  ENABLE_MULTI_TENANCY: "no",
  SUPPORTED_MODELS: [],
  NOTEBOOK_INSTANCE_TYPES: [],
  DATALOAD_LIMITS: {},
  permission: serviceLevelPermission
};

const globalConfig = createSlice({
  name: "globalConfig",
  initialState: GlobalConfigInitialState,
  reducers: {
    updateAppConfig( state, action ) {
      const configObj: Record<string, any> = action.payload;

      state = {
        ...state,
        ...configObj,
        permanentPaths: getAllRoutes( permanentPaths ),
        enforceMFA: configObj.ENFORCE_COGNITO_MFA?.toUpperCase(),
        isDRMode: isTruthyValue( configObj.isDRMode )
      };

      return state;
    },
    setDRModeAcknowledged( state, action ) {
      state.drModeAcknowledged = action.payload;
    }
  }
});

const { reducer } = globalConfig;
export const { setDRModeAcknowledged, updateAppConfig } = globalConfig.actions;
export default reducer;