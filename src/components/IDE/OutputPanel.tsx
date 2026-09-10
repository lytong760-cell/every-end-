import React, { useRef, useEffect } from 'react';

interface OutputPanelProps {
  output: string[];
  status: 'idle' | 'compiling' | 'success' | 'error';
  onClear: () => void;
  previewRef: React.RefObject<HTMLIFrameElement | null>;
}

export function OutputPanel({ output, status, onClear, previewRef }: OutputPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  const getLineClass = (line: string) => {
    if (line.includes('Error') || line.includes('error')) return 'error';
    if (line.includes('Warning') || line.includes('warning')) return 'warning';
    if (line.includes('successful') || line.includes('success')) return 'success';
    if (line.includes('Compiling')) return 'info';
    return '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="output-panel">
        <div className="output-header">
          <span>Output / Console</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="toolbar-button" onClick={onClear} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              Clear
            </button>
          </div>
        </div>
        <div className="output-content">
          {output.map((line, i) => (
            <div key={i} className={`output-line ${getLineClass(line)}`}>
              {line}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <iframe
        ref={previewRef as React.RefObject<HTMLIFrameElement>}
        title="Preview"
        sandbox="allow-scripts"
        style={{
          width: '100%',
          flex: 1,
          minHeight: 100,
          border: 'none',
          background: '#fff',
        }}
      />
    </div>
  );
}
