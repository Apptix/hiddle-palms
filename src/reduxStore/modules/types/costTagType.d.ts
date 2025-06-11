export interface ICostTagFormFields {
  TagKey: string;
  TagValues: Array<string>;
  TagName?: string;
  TagDescription?: string;
}

export interface IActionConfigurations {
  ActionType: "email" | "stop_resources" | undefined;
  Threshold: string;
  ThresholdType: "percentage" | "absolute_value" | undefined;
  Status?: "ALARM" | "OK";
}

export interface ICostBudgetItem {
  BudgetId: string;
  BudgetName: string;
  Description?: string;
  TagKey: string;
  TagValue: string;
  BudgetAmount: string;
  BudgetPeriod: string;
  BudgetAmountUsed?: string;
  CurrencyUnit?: string;
  ActionConfigurations: Array<IActionConfigurations>;
  LastModifiedTime: string;
  LastModifiedBy: string;
  CreatedBy: string;
  CreationTime: string;
}

export type TCostBudgetFormFields = Omit<
  ICostBudgetItem,
  "BudgetId"
  | "BudgetAmountUsed"
  | "LastModifiedTime"
  | "LastModifiedBy"
  | "CreatedBy"
  | "CreationTime"
>;

export interface ICostBudgetList {
  Budgets: Array<ICostBudgetFormFields>;
  next_available: string;
  count: number;
  total_count: number;
}

export interface ICostTagsList {
  CostTags: Array<ICostTagFormFields>;
  next_available: string;
  count: number;
  total_count: number;
}

export interface IUserInfoTimeInfo {
  LastModifiedTime: string;
  LastModifiedBy: string;
  CreatedBy: string;
  CreationTime: string;
}

export interface ICostTagDetails extends ICostTagFormFields, IUserInfoTimeInfo {
  Message: string;
  TagStatus: string;
}

export interface IUserCost {
  EmailId: string;
  Name: string;
  UserId: string;
}
export interface ICostAttachedUsers {
  UsersAttached: Array<IUserCost>;
}

export interface ITagValue {
  TagValue: string;
  TagKey: string;
}
export interface IResource {
  ResourceId: string;
  ResourceName: string;
}

export interface ICostResource {
  ResourceType: string;
  ResourceList: Array<IResource>
}
export interface ICostAttachedResources {
  Resources: Array<ICostResource>;
}

export interface IGetAttachedResource extends IResource, ITagValue {}

export interface IAttachedCostResource {
  ResourceType: string;
  ResourceList: Array<IGetAttachedResource>
}
export interface IGetAttachedResources {
  Resources: Array<IAttachedCostResource>;
}