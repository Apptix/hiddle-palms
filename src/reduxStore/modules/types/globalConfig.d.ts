// Methods / Hooks / Constants / Styles
import type { IRouteObject } from "#types/index";

type TFlagValue = "yes" | "no";

export type TGlobalConfigState = {
  permanentPaths: Record<string, IRouteObject>;
  idpLogin: boolean;
  TARGET_LOCATION: string[];
  FILE_TYPES: string[];
  SUPPORTED_MODELS: string[];
  enforceMFA: "OPTIONAL" | "MANDATORY" | "OFF";
  drModeAcknowledged: boolean;
  isDRMode: boolean;
  API_gateway?: string;
  clientId?: string;
  ENABLE_IDP?: TFlagValue;
  APP_WEB_DOMAIN?: string;
  IDENTITY_PROVIDER?: string;
  TOKEN_SCOPES_ARRAY?: string[];
  PROJECT_SHORT_NAME: string;
  PROJECT_NAME: string;
  VERSION: string;
  FEEDBACK_ADDRESS: string;
  ENVIRONMENT: string;
  DR_Message?: string;
  ENABLEVGW?: string;
  CUSTOMERMANAGEDVPC?: string
  WORKFLOW_TRANSCRIBE_SUPPORTED_LANGS?: Record<string, string>;
  ATHENA_WORKGROUPS_LIST?: string[];
  ENABLE_COSTMGMT?: "yes" | "no"
  ENABLE_HCLS: TFlagValue,
  ENABLED_HCLS_LIST: string,
  ENABLE_ES: TFlagValue,
  ENABLE_MULTI_TENANCY: TFlagValue,
  [otherVals: string]: any,
  ALLOWED_LOGS_RETENTION_PERIOD?: string[];
  NOTEBOOK_INSTANCE_TYPES: string[];
  DATALOAD_LIMITS: Record<string, string>,
  permission: any
};
