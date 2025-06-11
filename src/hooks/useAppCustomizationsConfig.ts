// Methods / Hooks / Constants / Styles
import type { TAppCustomizationsConfig } from "@/types/index";
import { appCustomizationsApi } from "@/reduxStore/services/appCustomizations";

/**
 * Returns the application customization config which is fetched from the public folder of the App
 * @returns {...TAppCustomizationsConfig} App Config - {@link TAppCustomizationsConfig}
 */
export const useAppCustomizationsConfig = (): TAppCustomizationsConfig | undefined => {
  const {
    currentData: appConfig
  } = appCustomizationsApi.endpoints.getAppCustomizationsConfig.useQueryState({ skipNotification: true });
  return appConfig;
};