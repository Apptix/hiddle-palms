import { useState } from "react";

/**
 * Function to use local storage, to store data in the browser.
 * Returns the stored value and a function to set the value.
 * @param key string to store the value in the browser
 * @param initialValue initial value to store in the browser
 * @returns [ storedValue, setValue ] - stored value and a function to set the value
 */
function useLocalStorage<T>( key: string, initialValue: T ) {
  const [ storedValue, setStoredValue ] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem( key );
      return item ? JSON.parse( item ) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = ( value: T ) => {
    try {
      setStoredValue( value );
      window.localStorage.setItem( key, JSON.stringify( value ));
    } catch {
      console.error( "Error occurred while saving to local storage" );
    }
  };

  return [ storedValue, setValue ] as const;
}

export default useLocalStorage;