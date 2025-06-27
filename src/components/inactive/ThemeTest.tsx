import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeTest: React.FC = () => {
  const { currentTheme, themeConfig, setTheme, availableThemes } = useTheme();
  
  // Dragging state
  const [position, setPosition] = useState({ x: 16, y: 16 }); // Start at top-right
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    
    // Prevent text selection while dragging
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={dragRef}
      className={`fixed glass-panel border border-theme-neutral-300 rounded-lg p-4 shadow-lg z-40 max-w-sm select-none ${
        isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag handle indicator */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-theme-neutral-900">🧪 Theme Foundation Test</h3>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-theme-neutral-400 rounded-full"></div>
          <div className="w-1 h-1 bg-theme-neutral-400 rounded-full"></div>
          <div className="w-1 h-1 bg-theme-neutral-400 rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Current Theme:</strong> {currentTheme}
        </div>
        <div>
          <strong>Display Name:</strong> {themeConfig.displayName}
        </div>
        <div>
          <strong>Description:</strong> {themeConfig.description}
        </div>
        <div>
          <strong>Available Themes:</strong> {availableThemes.length}
        </div>
        
        {/* Color Test Swatches */}
        <div className="mt-3">
          <strong>Primary Colors:</strong>
          <div className="flex gap-1 mt-1">
            {Object.entries(themeConfig.colors.primary).slice(0, 5).map(([shade, color]) => (
              <div
                key={shade}
                className="w-6 h-6 rounded border border-theme-neutral-300"
                style={{ backgroundColor: color }}
                title={`${shade}: ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Theme Switcher Test */}
        <div className="mt-3">
          <strong>Test Theme Switch:</strong>
          <div className="flex gap-2 mt-1">
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dragging when clicking buttons
                  setTheme(theme.name);
                }}
                className={`px-2 py-1 text-xs rounded border ${
                  currentTheme === theme.name 
                    ? 'bg-theme-primary-100 border-theme-primary-300 text-theme-primary-800' 
                    : 'bg-theme-neutral-100 border-theme-neutral-300 text-theme-neutral-700 hover:bg-theme-neutral-200'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Variables Test */}
        <div className="mt-3">
          <strong>CSS Variables Test:</strong>
          <div className="text-xs text-theme-neutral-600 mt-1">
            Primary-600: {getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600')}
          </div>
        </div>

        {/* Effects Test (for glassmorphism themes) */}
        {themeConfig.effects?.glassmorphism && (
          <div className="mt-3">
            <strong>Glassmorphism:</strong>
            <div className="text-xs text-green-600">✅ Enabled</div>
          </div>
        )}

        {/* Dragging Instructions */}
        <div className="mt-3 pt-2 border-t border-theme-neutral-200">
          <div className="text-xs text-theme-neutral-500">
            💡 Drag this panel to move it around
          </div>
        </div>
      </div>
    </div>
  );
};