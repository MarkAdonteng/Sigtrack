import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  onError: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const ErrorFallback: React.FC = () => (
  <div>
    <p>Something went wrong. Please refresh the page or try again later.</p>
  </div>
);

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to a logging service or handle it as needed
    console.error(error, errorInfo);
    this.props.onError();
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset the error state if children change
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
