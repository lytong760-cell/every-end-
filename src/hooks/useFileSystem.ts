import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadFiles, saveFiles, type FileNode, getLanguageFromPath } from '../services/fileSystem';

export function useFileSystem() {
  const [files, setFiles] = useState<FileNode[]>(() => loadFiles());
  const [activePath, setActivePath] = useState<string | null>(null);

  useEffect(() => {
    saveFiles(files);
  }, [files]);

  useEffect(() => {
    if (!activePath && files.length > 0) {
      setActivePath(files[0].path);
    }
  }, [activePath, files]);

  const createFile = useCallback((path: string) => {
    const language = getLanguageFromPath(path);
    const newFile: FileNode = { path, content: '', language };
    setFiles(prev => [...prev, newFile]);
    setActivePath(path);
    return newFile;
  }, []);

  const updateFile = useCallback((path: string, content: string) => {
    setFiles(prev =>
      prev.map(f => f.path === path ? { ...f, content } : f)
    );
  }, []);

  const deleteFile = useCallback((path: string) => {
    setFiles(prev => prev.filter(f => f.path !== path));
    setActivePath(prev => prev === path ? null : prev);
  }, []);

  const renameFile = useCallback((oldPath: string, newPath: string) => {
    setFiles(prev =>
      prev.map(f => f.path === oldPath ? { ...f, path: newPath, language: getLanguageFromPath(newPath) } : f)
    );
    setActivePath(prev => prev === oldPath ? newPath : prev);
  }, []);

  const activeFile = useMemo(
    () => files.find(f => f.path === activePath) || null,
    [files, activePath]
  );

  return {
    files,
    activeFile,
    activePath,
    setActivePath,
    createFile,
    updateFile,
    deleteFile,
    renameFile,
    resetFiles: () => setFiles([]),
  };
}
