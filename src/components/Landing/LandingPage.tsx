import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const Hero3D = lazy(() => import('./Hero3D').then(m => ({ default: m.Hero3D })));
import AnimatedTitle from '../react-bits/BlurText';
import GlareHover from '../react-bits/GlareHover';

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="landing-page">
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </ErrorBoundary>
      <div className="landing-overlay">
        <AnimatedTitle
          text="every"
          delay={150}
          direction="top"
          duration={0.9}
          className="landing-title"
        />
        <p className="landing-subtitle">
          A browser-based development environment with built-in compilers,
           3D visuals, and support for all your favorite languages.
        </p>
        <GlareHover
          width="auto"
          height="auto"
          background="var(--accent)"
          borderRadius="var(--radius)"
          borderColor="var(--accent)"
          glareColor="#ffffff"
          glareOpacity={0.3}
          transitionDuration={600}
          className="cta-button-wrapper"
        >
          <button className="cta-button" onClick={onLaunch}>
            Open IDE
          </button>
        </GlareHover>
      </div>
    </div>
  );
}
