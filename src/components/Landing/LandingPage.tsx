import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const Hero3D = lazy(() => import('./Hero3D').then(m => ({ default: m.Hero3D })));

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="landing-page">
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </ErrorBoundary>
      <div className="landing-overlay">
        <h1 className="landing-title">every-end</h1>
        <p className="landing-subtitle">
          A browser-based development environment with built-in compilers,
          3D visuals, and support for all your favorite languages.
        </p>
        <button className="cta-button" onClick={onLaunch}>
          Open IDE
        </button>
      </div>
    </div>
  );
}
