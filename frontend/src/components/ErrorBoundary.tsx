import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
                    <h2 className="text-xl font-bold text-red-800 mb-2">Что-то пошло не так</h2>
                    <p className="text-red-600 mb-4">Произошла ошибка при отрисовке интерфейса.</p>
                    <pre className="bg-white p-4 rounded border border-red-100 text-xs overflow-auto max-h-40 text-red-900">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Перезагрузить страницу
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
