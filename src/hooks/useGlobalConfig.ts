import { useAppSelector } from "./storeHooks";
import type { TGlobalConfigState } from "@/reduxStore/modules/types";

export const useGlobalConfig = (): TGlobalConfigState => {
  return useAppSelector(({ globalConfig }) => globalConfig );
};