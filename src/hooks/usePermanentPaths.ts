// Methods / Hooks / Constants / Styles
import type { IRouteObject } from "@/types/index";
import { useAppSelector } from "./storeHooks";

/**
 * Method returns the permanent paths from the store
 * @returns {...TPermanentPathObject} Permanent paths - {@link TPermanentPathObject}
 */

export const usePermanentPaths = (): Record<string, IRouteObject> => {
  const permanentPaths = useAppSelector(
    ({ globalConfig = { permanentPaths: {} } }) => globalConfig?.permanentPaths );
  return permanentPaths;
};

export const useRoutePath = ( permPathKey: string ): string => {
  const permanentPaths = usePermanentPaths();
  return permanentPaths?.[permPathKey]?.absolutePath;
};

export const useRouteObject = ( permPathKey: string ): IRouteObject => {
  const permanentPaths = usePermanentPaths();
  return permanentPaths?.[permPathKey];
};