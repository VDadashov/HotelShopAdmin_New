import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('errors.somethingWentWrong')}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('errors.unexpectedError')}
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
            <summary className="cursor-pointer font-medium mb-2">
              {t('errors.errorDetails')}
            </summary>
            <pre className="whitespace-pre-wrap text-xs text-red-600 dark:text-red-400">
              {error.toString()}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t('errors.tryAgain')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            {t('errors.reloadPage')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
