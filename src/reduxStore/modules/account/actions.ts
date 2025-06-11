// Libraries
import { Dispatch } from "redux";

// Methods / Hooks / Constants / Styles
import { updateAccount, updateAccountInitLogin } from "./slice";
import type { TAppThunk } from "@/types/index";
import { extractError } from "@/utils/index";
import { validateSession } from "../auth/actions";

/**
 * Function to sanitize the API URL by removing the trailing slash
 */
export const sanitizeApiUrl = ( url: string ): string => {
  return url.replace( /\/$/, "" );
};

/**
 * Action to fetch the user account details
 * @param username Username of the user to fetch
 * @param initialLoad (optional / default=false) property to indicate if this is the initial load of the user account, it triggers default role fetching if true
 * @param silent (optional / default=false) property to indicate if the user account should be fetched silently,
 * it will not show any notification or role fetching
 * @param retryCount (optional) property to indicate the number of retries to fetch the user account
 */

export const loadUserAccount = ( username: string, initialLoad = false, silent = false, retryCount = 0 ): TAppThunk => {
  return ( dispatch: Dispatch<any>, getState ): Promise<any> => {
    const { account: { RoleId: currentRoleId }, globalConfig: { API_gateway = "" } } = getState();
    const updateAccountAction = initialLoad ? updateAccountInitLogin : updateAccount;
    dispatch( validateSession());
    dispatch( updateAccountAction({ fetchingUser: !silent, silentFetchUser: silent, fetchingUserError: undefined }));
    return fetch( `${sanitizeApiUrl( API_gateway )}/users/${ username}`, {
      method: "GET",
      headers: {
        "Authorization": getState()?.auth?.idToken
      }
    }).then( response => {
      if ( response?.status === 200 ) {
        return response?.json();
      }
      throw new Error( "Error fetching user data" );
    }).then( response => {
      const userAccount = response;
      dispatch( updateAccountAction({
        ...userAccount,
        RoleId: initialLoad ? userAccount?.CurrentRole : ( currentRoleId ?? userAccount?.DefaultRole ),
        fetchingUser: false,
        silentFetchUser: false,
        fetchingUserError: "notFound"
      }));
    }).catch( error => {
      if ( retryCount < 2 ) {
        dispatch( loadUserAccount( username, initialLoad, silent, retryCount + 1 ));
      } else {
        dispatch( updateAccountAction({ fetchingUserError: extractError({ error }) }));
      }
    }).finally(() => {
      dispatch( updateAccountAction({ fetchingUser: false, silentFetchUser: false }));
    });
  };
};
