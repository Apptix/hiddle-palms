import {
  callBackAppNameKey, callBackClaimsKey,
  callBackUriKey, localStorageCallBackAppNameKey, localStorageCallbackCallBackKey,
  localStorageCallBackClaimsKey,
  localStorageRedirectCallBackKey, redirectUriKey
} from "@/constants/index";

export type TQPKeyTypes =
  | typeof redirectUriKey
  | typeof callBackUriKey;

export interface IValidCallbackObj {
  [callBackUriKey]: string,
  [callBackClaimsKey]: string,
  [callBackAppNameKey]: string
}

/** -------------------------------------------REDIRECT RELATED METHODS------------------------------------- */

/*
  Fetch the redirect url from window.location object
*/
export const getRedirectUrl = (): string => {
  const searchParams = new URLSearchParams( window.location.search );
  return searchParams?.get( redirectUriKey ) ?? "";
};

// Append the redirectUriKey Query parma to the path if valid URL
export const appendRedirectUrl = ( navigatePath: string, redirectURL: string ): string => {
  let isValidGeneralUrl = false;
  // check if redirectURL is a valid complete url
  try {
    // check if redirect URL is a valid url other than same origin
    isValidGeneralUrl = redirectURL && new URL( redirectURL ) ? true : false;
    //eslint-disable-next-line no-empty
  } finally { }

  return `${navigatePath}${isValidGeneralUrl ? `?${redirectUriKey}=${redirectURL}` : ""}`;
};

/*
  Sets the passed redirect callback url in local storage with keyname localStorageRedirectCallBackKey.
  Useful when using fedarated IDP logins like okta, google etc.
*/
export const setLSRedirectCallbackUrl = ( url: string ): void => {
  if ( url ) {
    localStorage.setItem( localStorageRedirectCallBackKey, url );
  }
};

/*
  Fetch the query params from local storage localStorageRedirectCallBackKey.
  Clears the localStorageRedirectCallBackKey after fetching.
*/
export const getLSRedirectCallbackUrl = () => {
  const cbUrl = localStorage.getItem( localStorageRedirectCallBackKey ) || "";
  if ( cbUrl ) {
    localStorage.removeItem( localStorageRedirectCallBackKey );
  }
  return cbUrl;
};

/** ----------------------------------------CALLBACKS RELATED METHODS-------------------------------------- */

/*
  Fetch the callback url from window.location object
*/
export const getCallbackUrl = () : IValidCallbackObj => {
  const callbackParams: IValidCallbackObj = {
    [callBackUriKey]: "",
    [callBackClaimsKey]: "",
    [callBackAppNameKey]: ""
  };
  const searchParams = new URLSearchParams( window.location.search );
  callbackParams[callBackUriKey] = searchParams?.get( callBackUriKey ) ?? "";
  callbackParams[callBackClaimsKey] = searchParams?.get( callBackClaimsKey ) ?? "";
  callbackParams[callBackAppNameKey] = searchParams?.get( callBackAppNameKey ) ?? "";
  return callbackParams;
};

// Append a url (redirect or callback) Query param to the path if valid URL
// User to ensure qpUrl, qpClaims, qaAppName are url encoded
export const appendCallbackUrl = ( navigatePath: string, qpUrl?: string, qpClaims = "username", qaAppName?: string ): string => {
  let readyToAppend = false;
  // check if url is a valid complete url
  try {
    // check if redirect URL is a valid url other than same origin
    const isValidGeneralUrl = qpUrl && new URL( qpUrl ) ? true : false;

    // GOOD-TO-HAVE: We can split qpClaims and find out if its format is acceptable.
    readyToAppend = isValidGeneralUrl && qpClaims ? true : false;

    //eslint-disable-next-line no-empty
  } finally { }

  return `${navigatePath}${readyToAppend ?
    `?${callBackUriKey}=${qpUrl}&&${callBackClaimsKey}=${qpClaims}${qaAppName ? `&&${callBackAppNameKey}=${qaAppName}` : ""}`
    : ""}`;
};

/*
  Sets the passed callback's callback url in local storage with keyname localStorageRedirectCallBackKey.
  Useful when using fedarated IDP logins like okta, google etc.
*/
export const setLSCallbackCallbackUrl = ( url: string, claims = "username", appName?: string ): void => {
  if ( url ){
    localStorage.setItem( localStorageCallbackCallBackKey, url );
  }
  if ( claims ) {
    localStorage.setItem( localStorageCallBackClaimsKey, claims );
  }
  if ( appName ) {
    localStorage.setItem( localStorageCallBackAppNameKey, appName || "" );
  }
};

/*
  Fetch the query params from local storage localStorageRedirectCallBackKey.
  Clears the localStorageRedirectCallBackKey after fetching.
*/
export const getLSCallbackCallbackUrl = (): IValidCallbackObj => {
  const cbUrl = localStorage.getItem( localStorageCallbackCallBackKey ) || "";
  const cbClaims = localStorage.getItem( localStorageCallBackClaimsKey ) || "";
  const cbAppName = localStorage.getItem( localStorageCallBackAppNameKey ) || "";
  localStorage.removeItem( localStorageCallbackCallBackKey );
  localStorage.removeItem( localStorageCallBackClaimsKey );
  localStorage.removeItem( localStorageCallBackAppNameKey );
  return {
    [callBackUriKey]: cbUrl,
    [callBackClaimsKey]: cbClaims,
    [callBackAppNameKey]: cbAppName || ""
  };
};

/** ----------------------------------------OBLITEREATE BELOW SOON----------------------------------------- */

// Append a url (redirect or callback) Query param to the path if valid URL
export const appendQPUrl = ( navigatePath: string, key: TQPKeyTypes, url: string ): string => {
  let isValidGeneralUrl = false;
  // check if redirectURL is a valid complete url
  try {
    // check if redirect URL is a valid url other than same origin
    isValidGeneralUrl = url && new URL( url ) ? true : false;
    //eslint-disable-next-line no-empty
  } finally { }

  return `${navigatePath}${isValidGeneralUrl ? `?${key}=${url}` : ""}`;
};