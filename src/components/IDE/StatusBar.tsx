import React from 'react';

interface StatusBarProps {
  activeFile: { path: string; language: string } | null;
  compileStatus: 'idle' | 'compiling' | 'success' | 'error';
  errorCount: number;
}

export function StatusBar({ activeFile, compileStatus, errorCount }: StatusBarProps) {
  const getStatusLabel = () => {
    switch (compileStatus) {
      case 'compiling': return 'Compiling...';
      case 'success': return 'Ready';
      case 'error': return 'Error';
      default: return 'Ready';
    }
  };

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <div className="status-indicator">
          <span className={`status-dot ${compileStatus}`} />
          <span>{getStatusLabel()}</span>
        </div>
        {activeFile && (
          <span>
            {activeFile.language}
          </span>
        )}
      </div>
      <div className="status-bar-right">
        {errorCount > 0 && <span style={{ color: 'var(--error)' }}>{errorCount} errors</span>}
        <span>every-end IDE</span>
      </div>
    </div>
  );
}
