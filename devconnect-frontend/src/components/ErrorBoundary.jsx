// src/components/ErrorBoundary.jsx
// Catches JavaScript errors in child components
// Prevents entire app from crashing

import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    // Called when error occurs — update state
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    // Called after error — log details
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        this.setState({ errorInfo });
        // In production: send to error tracking service
        // e.g. Sentry.captureException(error)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f9fafb',
                    padding: '24px',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '64px', marginBottom: '16px' }}>💥</p>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px' }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>

                    {/* Show error details in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <details style={{
                            background: '#1e1e2e',
                            color: '#cdd6f4',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            textAlign: 'left',
                            maxWidth: '600px',
                            width: '100%',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                        }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '8px', color: '#f38ba8' }}>
                                Error Details (dev only)
                            </summary>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            style={{
                                padding: '12px 24px',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            🔄 Reload Page
                        </button>
                        <Link
                            to="/"
                            onClick={() => this.setState({ hasError: false, error: null })}
                            style={{
                                padding: '12px 24px',
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                            }}
                        >
                            🏠 Go Home
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;