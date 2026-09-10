import React, { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

interface EditorPanelProps {
  file: { path: string; content: string; language: string } | null;
  onChange: (content: string) => void;
}

export function EditorPanel({ file, onChange }: EditorPanelProps) {
  const language = useMemo(() => {
    if (!file) return 'plaintext';
    const ext = file.path.split('.').pop()?.toLowerCase() || '';
    const monacoLangMap: Record<string, string> = {
      js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
      html: 'html', css: 'css', json: 'json', vue: 'html', svelte: 'html',
      py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
      c: 'c', cpp: 'cpp', cs: 'csharp', php: 'php', sql: 'sql',
      sh: 'shell', bash: 'shell', swift: 'swift', kt: 'kotlin',
      lua: 'lua', hs: 'haskell', clj: 'clojure', ex: 'elixir',
    };
    return monacoLangMap[ext] || 'plaintext';
  }, [file]);

  if (!file) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <div className="empty-state-title">No file selected</div>
        <div className="empty-state-desc">Select a file from the explorer or create a new one to start editing.</div>
      </div>
    );
  }

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language={language}
        value={file.content}
        theme="vs-dark"
        onChange={(value) => onChange(value || '')}
        options={{
          fontSize: 14,
          fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 8,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrapColumn: 80,
          bracketPairColorization: { enabled: true },
          padding: { top: 8 },
        }}
        loading={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b949e' }}>
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
