// Libraries
import { useEffect } from "react";

// Methods / Hooks / Constants / Styles
import { useAppSelector } from "./storeHooks";

export function useTheme(): void {
  const systemTheme = window.matchMedia( "(prefers-color-scheme: dark)" );
  // TODO: update systemTheme match to dark when all darkMode screens are vetted. @susheel Jan 14, 2025
  // Ignore the systemTheme and set light more as default until all dark mode screens are vetted properly
  const cachedTheme = localStorage.getItem( "theme" ) ?? ( systemTheme.matches ? "light" : "light" );
  const {
    darkMode = cachedTheme === "dark"
  } = useAppSelector(({ account }) => ({
    darkMode: account?.Preferences?.darkMode
  }));

  /** Update local storage with the selected theme */
  useEffect(() => {
    localStorage.setItem( "theme", darkMode ? "dark" : "light" );
  }, [darkMode]);

  /** Apply the selected theme */
  useEffect(() => {
    if ( darkMode ){
      document.body.classList.add( "dark" );
      document.body.classList.add( "adp-dark" );
    } else {
      document.body.classList.remove( "dark" );
      document.body.classList.remove( "adp-dark" );
    }
  }, [darkMode]);

  /** Listen for system theme changes */
  useEffect(() => {
    const handleThemeChange = ( e: MediaQueryListEvent ) => {
      const newTheme = e.matches ? "dark" : "light";
      localStorage.setItem( "theme", newTheme );
      if ( e.matches ) {
        document.body.classList.add( "dark", "adp-dark" );
      } else {
        document.body.classList.remove( "dark", "adp-dark" );
      }
    };

    systemTheme.addEventListener( "change", handleThemeChange );
    return () => systemTheme.removeEventListener( "change", handleThemeChange );
  }, [systemTheme]);
}