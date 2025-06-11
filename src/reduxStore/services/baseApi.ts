// Libraries
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
  createApi
} from "@reduxjs/toolkit/query/react";
import { Auth } from "aws-amplify";
import dayjs from "dayjs";
import jwtDecode, { JwtPayload } from "jwt-decode";

// Methods / Hooks / Constants / Styles
import { tagTypes } from "./tagTypes";
import type { TRootState } from "@/types/index";
import { extractError, regexCompareStrings } from "@/utils/index";
import { updateAuthReducer } from "../modules/auth/actions";
import { extraOptionParams } from "@/constants";

const InvalidTokenErrorMessage = ["Token does not belong to this application"];

const query = ( API_gateway:string ) => fetchBaseQuery({
  baseUrl: API_gateway,
  prepareHeaders: ( headers, { getState }) => {
    // const { globalConfig: { DefaultRole = "" }, auth: { idToken }, roleDetails: { RoleId } } = getState() as TRootState;
    const { auth } = getState() as TRootState;

    if ( auth?.idToken ) {
      headers.set( "authorization", auth.idToken );
    }

    return headers;
  },
  timeout: 35000
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = retry( async ( args, api, extraOptions ) => {
  const { globalConfig: { API_gateway = "" } } = api?.getState() as TRootState;
  // Query Fire
  let result = await query( API_gateway )( args, api, extraOptions );

  if ( result?.error ){
    try {
      //code to update the token if the token has been expired
      if ( result.error?.status === 401 || result.error?.status === 403 ) {
        if ( InvalidTokenErrorMessage.some( m => regexCompareStrings( m, extractError({ error: result?.error })))){
          // User has invalid token, force user to login again
          api.dispatch( updateAuthReducer({ validSession: false }));
        }
        const configuredToken = result.meta?.request?.headers?.get( "Authorization" ) || "";
        const { exp } = configuredToken && jwtDecode<JwtPayload>( configuredToken ) || {};
        if ( exp && dayjs().isAfter( dayjs.unix( exp ))) {
          try {
            const cognitoUserSession: any = await Auth.currentSession();
            api.dispatch( updateAuthReducer({
              idToken: cognitoUserSession?.idToken?.jwtToken,
              sessionActive: true,
              validSession: true
            }));
            result = await query( API_gateway )( args, api, extraOptions );
          } catch {
            console.error( "Error updating auth reducer" );
            api.dispatch( updateAuthReducer({ validSession: false }));
          }
        }
      }
    } catch {
      return result;
    }
  }
  return result;

}, { maxRetries: extraOptionParams.maxRetries });

const baseApi = createApi({
  baseQuery,
  reducerPath: "baseApi",
  tagTypes: Object.values( tagTypes ),
  endpoints: () => ({})
});

export default baseApi;