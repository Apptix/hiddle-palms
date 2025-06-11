// Methods / Hooks / Constants / Styles
import type { TPermanentPathObject, IRouteObject } from "@/types/index";
export const getAllRoutes = ( permanentPaths: TPermanentPathObject = {}): Record<string, IRouteObject> => {
  try {
    const paths: Record<string, IRouteObject> = {};
    Object.entries( permanentPaths )?.forEach(([ identifier = "root" as string, obj ]) => {
      const { parent, path, externalLink = false }: Partial<IRouteObject> = obj;
      if ( identifier === "root" ) {
        paths[identifier] = { ...obj, path: "/", absolutePath: "/" };
      } else {
        paths[identifier] = {
          ...obj,
          // This needs to be a recursive logic if the route is more than 2 levels deep
          absolutePath: parent === "root" ? ( externalLink ? path : `/${path}` ) : parent && paths[parent] ? `/${paths[parent].path}/${path}` : `/${path}`
        };
      }
    });
    return paths;

  } catch {
    console.error( "Error getting all routes" );
    return {};
  }
};

interface IGetStringOrDefault {
  value: string | undefined;
  defaultValue?: string;
}

export const getStringOrDefault = ( props: IGetStringOrDefault ): string => {
  return props?.value || ( props?.defaultValue ?? "" );
};

interface IGetBooleanOrDefault {
  value: boolean | string | undefined;
  trueString?: string;
  falseString?: string;
}

export const getBooleanOrDefault = ( props: IGetBooleanOrDefault ): string => {
  if ( typeof props.value === "string" ) {
    return ( props?.value.localeCompare( "yes", undefined, { sensitivity: "base" }) === 0
      ? props?.trueString
      : props?.falseString
    ) || "";
  }
  return ( props.value === true ? props?.trueString : props?.falseString ) || "";
};
