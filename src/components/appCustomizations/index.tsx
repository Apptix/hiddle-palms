// libraries
import { Suspense, useEffect, ReactNode } from "react";
import i18n from "@/i18n/i18nConfig";
import { Amplify } from "aws-amplify";

// components
// import PageLoadSpinner from "#components/pageLoadSpinner";

// hooks / constants / styles
import { useGetAppConfigQuery, useGetAppCustomizationsConfigQuery } from "@/reduxStore/services/appCustomizations";
import { useAppDispatch } from "@/hooks/index";
import { updateAppConfig } from "@/reduxStore/modules/globalConfig/slice";
import appConfigJSON from "@/configs/appConfig.json";
import { Loader } from "../ui/loader";

interface IAppCustomizationProps {
  children: ReactNode;
}

const isDev = process.env.NODE_ENV === "development";

//Wrapper component to apply various customizations
export const AppCustomizations = ({
  children
}: IAppCustomizationProps ): JSX.Element => {
  const dispatch = useAppDispatch();

  const { data: customizationsData, isFetching: fetchingCustomizations } =
  useGetAppCustomizationsConfigQuery({ skipNotification: true }, { skip: isDev });

  const { data: appConfigData = appConfigJSON, isFetching: fetchingAppConfig } =
  useGetAppConfigQuery({ skipNotification: true }, { skip: isDev });

  // Persist the appConfig in the globalConfig reducer slice
  useEffect(() => {
    if ( appConfigData && !fetchingAppConfig ) {

      Amplify.configure({
        Auth: {
          // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
          identityPoolId: appConfigData.identityPool,
          // REQUIRED - Amazon Cognito Region
          region: appConfigData.region,
          // OPTIONAL - Amazon Cognito User Pool ID
          userPoolId: appConfigData.userPool,
          // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
          userPoolWebClientId: appConfigData.clientId,
          oauth: {
            domain: appConfigData?.APP_WEB_DOMAIN ?? window.location.origin,
            scope: appConfigData?.TOKEN_SCOPES_ARRAY ?? [],
            redirectSignIn: `${window.location.origin}/callback`,
            redirectSignOut: `${window.location.origin}/auth/login`,
            responseType: "code"
          }
        }
      });

      dispatch( updateAppConfig( appConfigData ));
    }
  }, [ appConfigData, dispatch, fetchingAppConfig ]);

  // Effect to compute the static namespace during app-load.
  // Unless a new appConfig is loaded forcefully by busting cache, this wont re-compute wiz. desirable
  useEffect(() => {
    if ( customizationsData && Object.keys( customizationsData ).length > 0 ) {
      const aliases: Record<string, unknown> = customizationsData?.aliases ?? {};

      Object.keys( aliases ).forEach(( lng: string ) => {
        i18n.addResourceBundle( lng, "static", aliases[lng], false, true );
      });
    }
  }, [customizationsData]);

  if ( fetchingCustomizations || fetchingAppConfig ) {
    return <Loader />;
  }

  return <Suspense fallback={<Loader />}>
    {children}
  </Suspense>;
};

