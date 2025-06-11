// libraries
import React from "react";

// Components
import Layout from "../layout/Layout";
import { EmptyState } from "../ui/empty-state/empty-state";

// Methods / Hooks / Constants / Styles

type TProps = {
  /**
     * Pass a callback which will be called whenever an error is caught by the ErrorBoundary
     */
  errorCallback?: () => void;
  /**
     * Fallback component to render when an error is caught by the ErrorBoundary
     */
  fallbackContent?: React.ReactNode;
  children?: React.ReactNode;
};

type TState = {
  /**
     * Flag to indicate if an error has been caught by the ErrorBoundary
     */
  hasError: boolean;
};

/**
 * ErrorBoundary component to catch errors in the children components and render a fallback UI.
 * It also logs the error to the console and calls the errorCallback if provided.
 * translations and dispatches are deliberately not included in the component as the error origin is unknown.
 * @param {TProps} props
 * @returns {React.ReactElement}
 */
export class GlobalErrorBoundary extends React.Component<TProps, TState> {
  constructor( props: TProps ) {
    super( props );
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.errorCallback?.();
  }

  render() {
    if ( this.state.hasError ) {
      return (
        this?.props?.fallbackContent ?? (
          <Layout>
            <div className="container min-h-screen flex items-center justify-center">
              <EmptyState
                title="Error"
                description="Something went wrong, please try again."
                variant="noAccess"
                buttonText="Try Reload"
                onAction={() => window.location.reload()}
              />
            </div>
          </Layout>
        )
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;