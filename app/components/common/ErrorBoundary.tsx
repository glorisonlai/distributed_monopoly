import React from "react";

type ErrorState = { hasError: boolean };

class ErrorBoundary extends React.Component<{}, ErrorState> {
  constructor(props: React.ReactPropTypes) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error);

    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="font-bold text-red-400">
            Something went wrong. Check whether link points to valid GLTF
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
