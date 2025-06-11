import React, { StrictMode } from "react";
import { persistor, store } from "@/reduxStore";

import { AppCustomizations } from "../appCustomizations";
import { BrowserRouter } from "react-router";
import GlobalErrorBoundary from "../ErrorBoundary";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

interface IAppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: IAppProvidersProps ) => {
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <GlobalErrorBoundary>
              <Toaster />
              <Sonner />
              <AppCustomizations>
                {children}
              </AppCustomizations>
            </GlobalErrorBoundary>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};

export default AppProviders;