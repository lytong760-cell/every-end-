import React, { useState, useCallback, useMemo } from 'react';
import { FileExplorer } from './FileExplorer';
import { TabsBar } from './TabsBar';
import { EditorPanel } from './EditorPanel';
import { OutputPanel } from './OutputPanel';
import { StatusBar } from './StatusBar';
import { ResizeHandle } from './ResizeHandle';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useCompiler } from '../../hooks/useCompiler';
import type { FileNode } from '../../services/fileSystem';

export function IDE() {
  const {
    files,
    activeFile,
    activePath,
    setActivePath,
    createFile,
    updateFile,
    deleteFile,
    renameFile,
  } = useFileSystem();

  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [explorerWidth, setExplorerWidth] = useState(240);
  const [outputHeight, setOutputHeight] = useState(200);
  const [isCompiling, setIsCompiling] = useState(false);

  const { status, output, previewRef, run, clearOutput } = useCompiler();

  const tabs = useMemo(() => {
    return openTabs
      .map(path => files.find(f => f.path === path))
      .filter((f): f is FileNode => f !== undefined)
      .map(f => ({ path: f.path, name: f.path }));
  }, [openTabs, files]);

  const handleSelectFile = useCallback((path: string) => {
    setActivePath(path);
    setOpenTabs(prev => {
      if (!prev.includes(path)) {
        return [...prev, path];
      }
      return prev;
    });
  }, [setActivePath]);

  const handleCloseTab = useCallback((path: string) => {
    setOpenTabs(prev => {
      const next = prev.filter(p => p !== path);
      if (activePath === path && next.length > 0) {
        setActivePath(next[next.length - 1]);
      } else if (next.length === 0) {
        setActivePath(null);
      }
      return next;
    });
  }, [activePath, setActivePath]);

  const handleEditorChange = useCallback((content: string) => {
    if (activePath) {
      updateFile(activePath, content);
    }
  }, [activePath, updateFile]);

  const handleRun = useCallback(() => {
    if (!activeFile) return;
    setIsCompiling(true);
    run(activeFile.content, activeFile.language, activeFile.path);
    setTimeout(() => setIsCompiling(false), 100);
  }, [activeFile, run]);

  const handleCreateFile = useCallback((path: string) => {
    createFile(path);
    setOpenTabs(prev => [...prev, path]);
  }, [createFile]);

  const errorCount = useMemo(() => {
    return output.filter(line => line.includes('Error') || line.includes('error')).length;
  }, [output]);

  return (
    <div className="ide-container">
      <div className="toolbar">
        <button className="toolbar-button run" onClick={handleRun} disabled={!activeFile || isCompiling}>
          ▶ Run
        </button>
        <select
          className="language-select"
          value={activeFile?.language || 'plaintext'}
          onChange={(e) => {
            // Language is auto-detected from file extension
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="vue">Vue</option>
          <option value="svelte">Svelte</option>
        </select>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {isCompiling ? 'Compiling...' : activeFile ? activeFile.path : 'No file open'}
        </span>
      </div>
      <div className="ide-main">
        <div style={{ width: explorerWidth, minWidth: 160, maxWidth: 400, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <FileExplorer
            files={files}
            activePath={activePath}
            onSelect={handleSelectFile}
            onCreate={handleCreateFile}
            onDelete={deleteFile}
            onRename={renameFile}
          />
        </div>
        <ResizeHandle
          direction="horizontal"
          onResize={(delta) => setExplorerWidth(prev => Math.max(160, Math.min(400, prev + delta)))}
        />
        <div className="editor-area">
          <TabsBar
            tabs={tabs}
            activePath={activePath}
            onSelect={setActivePath}
            onClose={handleCloseTab}
          />
          <EditorPanel file={activeFile} onChange={handleEditorChange} />
        </div>
      </div>
      <ResizeHandle
        direction="vertical"
        onResize={(delta) => setOutputHeight(prev => Math.max(100, Math.min(500, prev - delta)))}
      />
      <OutputPanel
        output={output}
        status={status}
        onClear={clearOutput}
        previewRef={previewRef}
      />
      <StatusBar
        activeFile={activeFile}
        compileStatus={status}
        errorCount={errorCount}
      />
    </div>
  );
}
