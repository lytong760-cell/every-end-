import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { IDE } from './components/IDE/IDE';

export default function App() {
  const [view, setView] = useState<'landing' | 'ide'>('landing');

  const handleLaunch = useCallback(() => {
    setView('ide');
  }, []);

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  return <IDE />;
}
