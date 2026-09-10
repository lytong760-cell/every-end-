import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Hero3D ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #1a1f35 0%, #0a0e17 100%)',
          zIndex: 0,
        }}>
          <div style={{ color: '#8b949e', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c9d1d9' }}>
              3D experience unavailable
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: 300 }}>
              The interactive visuals could not be loaded. You can still use the IDE below.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
