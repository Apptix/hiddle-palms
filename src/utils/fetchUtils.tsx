
export const encodeQueryParams = ( queryObject: { [key: string]: string | number }): string => {
  const queryParams = [];
  for ( const param in queryObject ) {
    if ( queryObject[param] === null || typeof queryObject[param] === "undefined" ) {
      continue;
    }
    queryParams.push( `${encodeURIComponent( param )}=${encodeURIComponent( queryObject[param])}` );
  }
  return queryParams.join( "&" );
};

export const urlBuilder = ( path:string | string[], queryParam?: Record<string, any> ): string => {
  let url = "";

  if ( Array.isArray( path )){
    url = url.concat( path.join( "/" ));
  } else {
    url = url.concat( path );
  }

  if ( queryParam && Object.keys( queryParam ).length > 0 ) {
    url = url.concat( `?${encodeQueryParams( queryParam )}` );
  }

  return url;
};
/**
 * Get # props from url
 * @returns {Object} hashParams
 */
export const getHashParams = (): Record<string, string> => {
  const hashParams = {};
  const hash = window.location.hash.substring( 1 );
  const params = hash.split( "&" );
  params.forEach( param => {
    const [ key, value ] = param.split( "=" );
    ( hashParams as any )[key] = value?.toLocaleLowerCase();
  });
  return hashParams;
};
