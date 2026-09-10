import React, { useState, useRef, useEffect } from 'react';
import type { FileNode } from '../../services/fileSystem';

interface FileExplorerProps {
  files: FileNode[];
  activePath: string | null;
  onSelect: (path: string) => void;
  onCreate: (path: string) => void;
  onDelete: (path: string) => void;
  onRename: (oldPath: string, newPath: string) => void;
}

export function FileExplorer({
  files,
  activePath,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: FileExplorerProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPath && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingPath]);

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  const handleDoubleClick = (path: string) => {
    setEditingPath(path);
    setEditValue(path);
  };

  const handleRenameSubmit = () => {
    if (editingPath && editValue.trim() && editValue !== editingPath) {
      onRename(editingPath, editValue.trim());
    }
    setEditingPath(null);
    setEditValue('');
  };

  const handleNewFile = () => {
    const name = prompt('Enter file name (e.g., App.jsx):');
    if (name && name.trim()) {
      onCreate(name.trim());
    }
  };

  const handleDelete = (path: string) => {
    if (confirm(`Delete "${path}"?`)) {
      onDelete(path);
    }
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const getFileIcon = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
      js: '📜', jsx: '⚛️', ts: '📘', tsx: '🔷', html: '🌐',
      css: '🎨', json: '📋', vue: '💚', svelte: '🔥', py: '🐍',
    };
    return icons[ext] || '📄';
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <span>Explorer</span>
        <button className="toolbar-button" onClick={handleNewFile} title="New File">
          +
        </button>
      </div>
      <div className="file-list">
        {files.map(file => (
          <div
            key={file.path}
            className={`file-item ${file.path === activePath ? 'active' : ''}`}
            onClick={() => onSelect(file.path)}
            onContextMenu={(e) => handleContextMenu(e, file.path)}
            onDoubleClick={() => handleDoubleClick(file.path)}
          >
            <span className="file-icon">{getFileIcon(file.path)}</span>
            {editingPath === file.path ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit();
                  if (e.key === 'Escape') {
                    setEditingPath(null);
                    setEditValue('');
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ flex: 1, fontSize: '0.85rem', padding: '2px 4px' }}
              />
            ) : (
              <span className="file-name">{file.path}</span>
            )}
          </div>
        ))}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => {
            setEditingPath(contextMenu.path);
            setEditValue(contextMenu.path);
            setContextMenu(null);
          }}>
            ✏️ Rename
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={() => handleDelete(contextMenu.path)}>
            🗑️ Delete
          </div>
        </div>
      )}
    </div>
  );
}
