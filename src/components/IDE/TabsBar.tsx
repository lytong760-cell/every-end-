import React from 'react';

interface Tab {
  path: string;
  name: string;
}

interface TabsBarProps {
  tabs: Tab[];
  activePath: string | null;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}

export function TabsBar({ tabs, activePath, onSelect, onClose }: TabsBarProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="tabs-bar">
      {tabs.map(tab => (
        <div
          key={tab.path}
          className={`tab ${tab.path === activePath ? 'active' : ''}`}
          onClick={() => onSelect(tab.path)}
        >
          <span className="file-icon">📄</span>
          <span className="file-name">{tab.name}</span>
          <span
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.path);
            }}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}
