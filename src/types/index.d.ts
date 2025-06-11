// Methods / Hooks / Constants / Styles
import { UnknownAction, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { store } from "../reduxStore";
import type { IColumn as IDataTableColumn } from "@cloudwick/astral-ui/dist/components/dataTable";
import type { IADPIconProps } from "@cloudwick/astral-ui/dist/components/adpIcon";

import {
  AccessType,
  ResultsPerPageType,
  SortByType, SortOrderType,
  TimeDisplayType, TimeFormatType } from "#constants/index";

// Infer the `TRootState` type from the store itself
export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export type TAppThunk<ReturnType = void> = ThunkAction<ReturnType, TRootState, unknown, UnknownAction>;

export type TAppThunkDispatch = ThunkDispatch<TRootState, unknown, UnknownAction>;

export interface IMutationRequest extends ICustomMiddlewareArguments {
  requestBody?: any;
}

export type TADPIcon = IADPIconProps["icon"];
export interface IRouteObject {
  /**
   * Parent route object of the current route object
   */
  parent: string;
  /**
   * Parent route object of the current route shown in a breadcrumb
   */
  breadcrumbParent: string;
  /**
   * Absolute path WRT root (/)
   */
  absolutePath: string;
  /**
   * Current path
   */
  path: string;
  /**
   * Name of the route
   */
  name: string;
  /**
   * Permission required to access the route
   */
  permission: string;
  /**
   * Icon to be used for the route
   */
  icon?: string;
  /**
   * Conditions from the config file to match with
   */
  reqGlobalConfigCondition?: {
    /**
     * Config file key name
     */
    flag: string;
    /**
     * Value to match with the config file [key]: value
     */
    value: string | boolean;
  };
  /**
   * Flag to display route as BETA
   */
  beta?: boolean;
  /**
   * Flag to redirect user to externalLink instead of local re-routing
   */
  externalLink?: boolean;
  /**
   *  Description Related to the Route
   */
  description?: string;
}

export interface IGenericObject {
  [key: string]: unknown;
}

export type TPermanentPathObject = Record<string, RouteObject>;

export interface ITableRow {
  row: {
    [x: string]: any;
    original: Record<string, string | Array>;
  }
}

export interface INavItemObj {
  pathIdentifier: string;
  requiresIDPLogin?: boolean;
  visible: boolean;
  static?: boolean;
  disabled?: boolean;
}

export interface INavItemObjExtended extends INavItemObj {
  children?: Array<INavItemObj>;
  pathObject?: IRouteObject;
  path?: string
}

export interface ISideNavConfigItem extends INavItemObj {
  path: IRouteObject["path"];
  name: IRouteObject["name"];
  icon: IRouteObject["icon"];
}

export type TPermanentPathObject = Record<string, Omit<IRouteObject, "absolutePath">>;

export interface IOption {
  label: string | JSX.Element;
  value: any;
  [otherVals: string]: any;
}

export interface IIconOption {
  label: string;
  value: any;
  [otherVals: string]: any;
}

export interface IOption {
  label: string;
  value: any;
  [otherVals: string]: any;
}

export type TSelectedValues = string[] | string | boolean;
export type TOptions = IOption[] | { label: string, options: IOption[] }[];

/**
 * List of valid un-authenticated pages
 */
export type TUnAuthenticatedPages =
 | "loginPage"
 | "resetPasswordPage"
 | "registerPage"
 | "forgotPwdPage"
 | "forcePwdResetPage"
 | "setupMfaPage"
 | "verifyOtpPage"
 | "authenticatePage"
 | "resetPasswordSuccessPage"
 | "validateOtpPage";
export interface IAppCustomizationsProps {
  /**
   * Valid unauthenticated page name
   * valid values {@link TUnAuthenticatedPages}
   */
  pageName: TUnAuthenticatedPages;
}

export type TAppCustomizationsConfig = {
  [key in TUnAuthenticatedPages]?: {
    /**
     * coverImg shown on the left side of the page
     */
    illustrationImgProps: React.ImgHTMLAttributes<HTMLImageElement>;
    heading: {
      en: string;
    };
    subHeading: {
      en: string;
    };
  };
} & {
  /**
   * Path to the logo image. Use absolute path.
   * SVG is preferred.
   *
   * This is the large logo that appears in the top left corner
   * when the sidebar is expanded and on all un-authenticated pages
   */
  logoPath: string;
  /**
   * Path to the logo mark image. Use absolute path.
   * SVG is preferred.
   *
   * This is the small logo mark that appears in the top left corner when the sidebar is collapsed
   */
  condensedLogoPath: string;
  supportEmailAddress: string;
  /**
   * Name of the project, overrides the default project name
   */
  projectName: string;
  /**
   * Service name aliases.
   * This is used to override the default service names in the UI.
   *
   * For example, if you want to change the name of the "Tenants" service to "Organizations"
   * you can add an entry like this:
   * "tenants": "organizations"
   *
   * For example, if you want to change the name of the "Datasets" service to "Datastores"
   * you can add an entry like this:
   * "datasets": "datastores"
   */
  aliases: Record<string, unknown>;
  /**
   * Copy right statement to be displayed in the footer
   * Displays Cloudwick copy right statement by default
   */
  copyRightStatement?: string;
};

export interface ICustomMiddlewareArguments {
  skipNotification?: boolean;
}

export type TRouteReqKeys = keyof typeof routePermissions;
export type TUserRole = {
  RoleConsolidatedPermissions: Array<string>;
  RolePermissions: Array<string>;
};

export interface IStandardListingResponseShape {
  count: number,
  next_available: "yes" | "no",
  total_count: number,
};

// export type SortFilterQueryParams = { offset: number, limit:number, sortby?: string, sortorder?: string };
export type TSortFilterQueryParams = {
  offset?: number,
  limit?:number | string,
  sortby?: string,
  sortorder?: string,
  from_time?: string;
  from?:number;
  to_time?: string;
  projectionExpression?: string,
  filterExpression?: string | null,
  bulkJdbcDatasets?:boolean,
  task_start_time?: string,
};

export type TPermissionToCheck = string[] | Record<string, string> | string;
export type TPermissionCheckResult = Record<string, boolean>;

export interface IMutationRequest extends ICustomMiddlewareArguments {
  requestBody?: unknown;
}

export type TUserAgreement = { latestUserAgreement: { Version: string }, markdown: string };

export interface IUserPreferences {
  /**
   * SortBy types with generic identifiers
   */
  sortBy?: typeof SortByType[number];
  /**
   * SortOrder types - asc, desc
   */
  sortOrder?: typeof SortOrderType[number];
  /**
   * Number of results to fetch per API call
   */
  resultsPerPage?: typeof ResultsPerPageType[number];
  /**
   * User language preference
   */
  preferredLanguage?: string;
  /**
   * Tags/Keywords to be filled in by default
   */
  customTags?: {
    keywordPreferences: string[];
  };
  /**
   * Time format to display in 12hrs or 24hr format
   */
  timeFormat?: typeof TimeFormatType[number];
  /**
   * User timezone preference
   */
  timeZone?: string;
  /**
   * Time format to display in absolute or relative to current time
   */
  timeDisplay?: typeof TimeDisplayType[number];
  /**
   * User preferences for the app-theme
   */
  darkMode: boolean;
  /**
 * Default tag to be used for services creation
 */
  costTags?: { TagKey: string, TagValue: string }[]
}

export interface ICostTagItem {
  TagKey: string;
  TagValue: string;
}

export type TPermissionToCheck = string[] | Record<string, string> | string;
export type TPermissionCheckResult = Record<string, boolean>;

export interface IMutationRequest extends ICustomMiddlewareArguments {
  requestBody?: unknown;
}

export type TUserAgreement = { latestUserAgreement: { Version: string }, markdown: string };

// export type SortFilterQueryParams = { offset: number, limit:number, sortby?: string, sortorder?: string };
export type TSortFilterQueryParams = {
  offset?: number,
  limit?:number | string,
  sortby?: string,
  sortorder?: string,
  from_time?: string;
  from?:number;
  to_time?: string;
  projectionExpression?: string,
  filterExpression?: string | null,
  bulkJdbcDatasets?:boolean,
  task_start_time?: string,
};
export type TUserAgreement = { latestUserAgreement: { Version: string }, markdown: string };
export interface IPaginationState extends Required<Pick<UserPreferencesType, "sortBy" | "sortOrder">>{
  offset: number;
  limit: number;
  from_time?: string;
  to_time?: string;
}

export type TSortableFields = Record<string, string | { keyValue: string, keyDisplayName: string }>;

export interface IUserPreferences {
  /**
   * SortBy types with generic identifiers
   */
  sortBy?: typeof SortByType[number];
  /**
   * SortOrder types - asc, desc
   */
  sortOrder?: typeof SortOrderType[number];
  /**
   * Number of results to fetch per API call
   */
  resultsPerPage?: typeof ResultsPerPageType[number];
  /**
   * User language preference
   */
  preferredLanguage?: string;
  /**
   * Tags/Keywords to be filled in by default
   */
  customTags?: {
    keywordPreferences: string[];
  };
  /**
   * Time format to display in 12hrs or 24hr format
   */
  timeFormat?: typeof TimeFormatType[number];
  /**
   * User timezone preference
   */
  timeZone?: string;
  /**
   * Time format to display in absolute or relative to current time
   */
  timeDisplay?: typeof TimeDisplayType[number];
  /**
   * User preferences for the app-theme
   */
  darkMode?: boolean;
  /**
 * Default tag to be used for services creation
 */
  costTags?: { TagKey: string, TagValue: string }[]
}

export type TSortableFields = Record<string, string>;

export interface IPaginationData extends Required<Pick<IUserPreferences, "sortBy" | "sortOrder">>{
  offset: number;
  limit: number;
  from_time?: string;
  to_time?: string;
}

export interface IPaginationState {
  [key: string]: IPaginationData;
}

export interface ISortColumn {
  desc: boolean;
  id: string;
}

export type TColumn = IDataTableColumn;

export interface ICustomMiddlewareArguments {
  skipNotification?: boolean;
}

export type TSortFilterQueryParams = {
  offset?: number,
  limit?:number | string,
  sortby?: string,
  sortorder?: string,
  from_time?: string;
  from?:number;
  to_time?: string;
  projectionExpression?: string,
  filterExpression?: string | null,
  bulkJdbcDatasets?:boolean,
  task_start_time?: string,
} & IGeneralQueryParams;

export type TSortFilterQueryParams = {
  offset?: number,
  sortby?: string,
  sortorder?: string,
  from_time?: string;
  from?:number;
  to_time?: string;
  projectionExpression?: string,
  bulkJdbcDatasets?:boolean,
  task_start_time?: string,
};
export type TProjectionExpressionQueryParams = { projectionExpression: string };

export interface IDisplayField {
  FieldName: string,
  FieldProps: {
    fixed?: boolean,
    displayName?: string,
    [k: string]: boolean | string | undefined
  }
}

export interface IGroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  thisMonth: Notification[];
  thisYear: Notification[];
  older: Notification[];
}

export interface INotificationEvent extends Notification {
  NotificationId: string;
  LastModifiedTime: string;
  CreationTime: string;
  UserId?: string;
  Read?: "yes" | "no";
  Notification: {
    Type: string;
    Title: string;
    Message: string;
  };
}

export interface IOption {
  label: string;
  value: any;
}

export type TAccessType = typeof AccessType[number];
export type TAmorphicService = "datasets" |
  "glossaries" |
  "apps" |
  "datalabs" |
  "data-pipelines" |
  "jobs" |
  "tenants" |
  "domains" |
  "templates" |
  "ml-models" |
  "insights" |
  "jobslibs" |
  "code-repositories" |
  "datalabs-lifecycle-configurations" |
  "tags";

export interface IListingPreferences extends Required<Pick<IUserPreferences, "sortby" | "sortorder">>{
  offset: number;
  limit: number;
  sortorder: string;
  sortby: string;
  from_time?: string;
  to_time?: string;
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  filters?: Record<string, any>;
  setColumnOrder: ( colOrder: string[]) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  setColumnVisibility: ( colVisibility: Record<string, any> ) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  setSortingPreferences: ( id: string, desc: boolean ) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  setFilters: ( filters?: Record<string, any> ) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  setPageNumber: ( pageNumber: number ) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  setPageSize: ( size: number ) => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
  goToPreviousPage: () => {
    payload: any;
    type: "listingPreferences/updatePreferences";
  };
}

export interface IGeneralQueryParams {
  offset?: number;
  limit?:number | string;
  sortby?: string;
  sortorder?: string;
  projectionExpression?: string;
  filterExpression?: string | null;
};

export type TDirtyFields = {
  [key: string]: boolean | TDirtyFields;
} | boolean;
