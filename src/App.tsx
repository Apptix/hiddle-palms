import { enhanceFormAccessibility, runAccessibilityChecks } from "./lib/accessibility";

import AppProviders from "./components/providers";
import AppRoutes from "./routes/routing/AppRoutes";
import React from "react";

const App = () => {
  // Run accessibility checks in development to catch issues early
  React.useEffect(() => {
    if ( process.env.NODE_ENV === "development" ) {
      // Give the app time to render before running checks
      const timeoutId = setTimeout(() => {
        runAccessibilityChecks();
        enhanceFormAccessibility();
      }, 1000 );

      return () => clearTimeout( timeoutId );
    }
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;