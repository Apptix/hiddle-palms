import { Dispatch } from "react";

/**
 * Function to format query parameters
 * @param queryObject { [key: string]: string | number }
 * @returns string
 */
export const formatQueryParams = ( queryObject: { [key: string]: string | number }, encodeQueryParams: boolean ): string => {
  const queryParams = [];
  for ( const param in queryObject ) {
    if ( queryObject[param] === null || typeof queryObject[param] === "undefined" ) {
      continue;
    }

    if ( encodeQueryParams ) {
      queryParams.push( `${encodeURIComponent( param )}=${encodeURIComponent( queryObject[param])}` );
    } else {
      queryParams.push( `${param}=${queryObject[param]}` );
    }

  }
  return queryParams.join( "&" );
};

/**
 * Function to build URL with query parameters
 * @param path string | string[]
 * @param queryParam Record<string, any>
 * @param encodeQueryParams boolean | undefined
 * @returns string
 */
export const urlBuilder = ( path:string | string[], queryParam?: Record<string, any>, encodeQueryParams: boolean = true ): string => {
  let url = "";
  if ( Array.isArray( path )){
    url = url.concat( path.join( "/" ));
  } else {
    url = url.concat( path );
  }

  if ( queryParam && Object.keys( queryParam ).length > 0 ) {
    url = url.concat( `?${formatQueryParams( queryParam, encodeQueryParams )}` );
  }

  return url;
};

export const extractMessage = ( data: any, fallback = "" ): string => {
  if ([ "undefined", "null" ].includes( typeof data )) {
    return fallback;
  }

  return data?.Message ?? data?.message ?? ( typeof data === "string" ? data : fallback );
};

export const extractError = ( error: any, fallbackError = "Network Error" ): string => {
  if ( !error ) {
    return fallbackError;
  }

  // Check response data first
  if ( error.response?.data ) {
    return extractMessage( error.response.data, fallbackError );
  }

  // Check error data
  if ( error.data ) {
    return extractMessage( error.data, fallbackError );
  }

  // Check the error object itself
  return extractMessage( error, fallbackError );
};

export const asyncDispatcher = ( dispatch: Dispatch<any>, dispatchType: string, dispatchProps: Record<string, any> ): Promise<any> => {
  dispatch({ type: dispatchType, data: dispatchProps });
  return Promise.resolve();
};

/**
 * Function to copy text to clipboard
 * @param text string
 * @returns void
 */
export const copyToClipboard = async ( text: string, onSuccess: () => void ): Promise<void> => {
  await navigator.clipboard.writeText( text );
  onSuccess?.();
};

/**
 * @param {JSON} json Object that needs to be downloaded. NOTE - The object shouldn't have a function as a value.
 * @param {string} filename Name for the generated file. NOTE - Don't include the extension in the filename.
 */
export const downloadJSON = ( json: any, filename: string ): void => {
  const json_data = `data:text/json;charset=utf-8,${ encodeURIComponent( JSON.stringify( json ))}`;
  const dlAnchorElem = document.createElement( "a" );
  dlAnchorElem?.setAttribute( "href", json_data );
  dlAnchorElem?.setAttribute( "download", `${filename}.json` );
  dlAnchorElem?.click();
  if ( dlAnchorElem.parentNode ) {
    dlAnchorElem.parentNode.removeChild( dlAnchorElem );
  }
};

/**
 * Downloads a file from a given URL and triggers browser download with specified filename
 * @param {string} url - The URL of the file to download
 * @param {string} fileName - The name to be used for the downloaded file
 * @returns {Promise<void>}
 * @throws {Error} When the fetch request fails or blob creation fails
 * @example
 * // Download a document
 * await downloadDocument('https://example.com/file.pdf', 'document.pdf');
 */
export const downloadDocument = async ( url: string, fileName: string ): Promise<void> => {
  try {
    const response = await fetch( url );
    if ( !response.ok ) {
      throw new Error( `HTTP error! status: ${response.status}` );
    }
    const blob = await response.blob();

    // Create object URL for the blob
    const blobUrl = window.URL.createObjectURL( blob );

    // Use the download attribute of anchor tag
    const link = document.createElement( "a" );
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild( link );
    link.click();

    // Clean up
    document.body.removeChild( link );
    window.URL.revokeObjectURL( blobUrl );
  } catch ( error: unknown ) {
    console.error( "Error downloading document" );
    throw error;
  }
};