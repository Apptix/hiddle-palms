// Methods / Hooks / Constants / Styles
import type { TAppCustomizationsConfig, ICustomMiddlewareArguments } from "#types/index";
import customizationsBaseApi from "./customizationsBaseApi";

export const appCustomizationsApi = customizationsBaseApi.injectEndpoints({
  endpoints: ( build ) => ({
    getAppCustomizationsConfig: build.query<TAppCustomizationsConfig, ICustomMiddlewareArguments>({
      query: () => ({
        url: "customizations.json",
        timeout: 5000
      }),
      keepUnusedDataFor: 3600
    }),
    getAppConfig: build.query<any, ICustomMiddlewareArguments>({
      query: () => ({
        url: "appConfig.json",
        timeout: 5000
      }),
      keepUnusedDataFor: 3600
    }),
    getDetailedDRMessage: build.query<any, void>({
      query: () => ({
        url: "DRMessage.md",
        responseHandler: "text"
      }),
      keepUnusedDataFor: 3600
    })
  }),
  overrideExisting: true
});

export const {
  useGetAppCustomizationsConfigQuery,
  useGetAppConfigQuery,
  useGetDetailedDRMessageQuery
} = appCustomizationsApi;
