export type TCommonResource = {
  permission: string,
  permPathKey?: string,
  endpoint: any,
  searchPath?: string,
  responseMapping: string,
  fields: string[]
};

export type TCommonResourcesMapping = { [key: string]: TCommonResource };