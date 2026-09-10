const STORAGE_KEY = 'every-end-ide-files';

export interface FileNode {
  path: string;
  content: string;
  language: string;
}

const DEFAULT_FILES: FileNode[] = [
  {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
    language: 'html',
  },
  {
    path: 'App.jsx',
    content: `import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Hello, World!</h1>
      <p>Welcome to your new IDE.</p>
    </div>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);`,
    language: 'javascript',
  },
  {
    path: 'style.css',
    content: `body {
  margin: 0;
  background: #0d1117;
  color: #c9d1d9;
}

h1 {
  color: #58a6ff;
}`,
    language: 'css',
  },
];

export function loadFiles(): FileNode[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return [...DEFAULT_FILES];
}

export function saveFiles(files: FileNode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch {
    // storage full or unavailable
  }
}

export function resetFiles(): FileNode[] {
  localStorage.removeItem(STORAGE_KEY);
  return [...DEFAULT_FILES];
}

export function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function getLanguageFromPath(path: string): string {
  const ext = getFileExtension(path);
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    vue: 'vue',
    svelte: 'svelte',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    swift: 'swift',
    kt: 'kotlin',
    lua: 'lua',
    hs: 'haskell',
    clj: 'clojure',
    ex: 'elixir',
    er: 'erlang',
    fs: 'fsharp',
    asm: 'assembly',
    scala: 'scala',
    pl: 'perl',
    ml: 'ocaml',
    dart: 'dart',
    r: 'r',
    m: 'matlab',
    ps1: 'powershell',
    vb: 'vb',
    groovy: 'groovy',
    cob: 'cobol',
    for: 'fortran',
    pas: 'delphi',
    abap: 'abap',
    sas: 'sas',
    julia: 'julia',
    ocaml: 'ocaml',
  };
  return languageMap[ext] || 'plaintext';
}
