import React, { useCallback, useRef, useState, useEffect } from 'react';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  className?: string;
}

export function ResizeHandle({ direction, onResize, className = '' }: ResizeHandleProps) {
  const [isActive, setIsActive] = useState(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsActive(true);
    startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSize.current = 0;
  }, [direction]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPos.current;
      onResize(delta);
      startPos.current = currentPos;
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, direction, onResize]);

  if (direction === 'horizontal') {
    return (
      <div
        className={`resize-handle ${isActive ? 'active' : ''} ${className}`}
        onMouseDown={handleMouseDown}
      />
    );
  }

  return (
    <div
      className={`resize-handle-vertical ${isActive ? 'active' : ''} ${className}`}
      onMouseDown={handleMouseDown}
    />
  );
}
