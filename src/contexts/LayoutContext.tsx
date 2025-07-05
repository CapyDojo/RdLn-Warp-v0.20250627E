import React, { createContext, useContext, useState, useEffect } from 'react';

// Import layout styles directly
import '../styles/layouts/current-layout.css';
import '../styles/layouts/option-a-responsive.css';
import '../styles/layouts/option-b-container-queries.css';
import '../styles/layouts/option-c-fluid-scaling.css';
import '../styles/layouts/option-d-hybrid.css';

export type LayoutMode = 'current' | 'option-a' | 'option-b' | 'option-c' | 'option-d';

interface LayoutContextType {
  currentLayout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;
  supportsContainerQueries: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLayout, setCurrentLayout] = useState<LayoutMode>('current');
  const [supportsContainerQueries, setSupportsContainerQueries] = useState(false);

  // Check for container query support
  useEffect(() => {
    const checkContainerQuerySupport = () => {
      try {
        return CSS.supports('container-type: inline-size');
      } catch {
        return false;
      }
    };

    setSupportsContainerQueries(checkContainerQuerySupport());
  }, []);

  // CSS files are imported in index.css, so we just need to manage body classes

  // Apply layout class to body
  useEffect(() => {
    const bodyClassList = document.body.classList;
    
    // Remove all layout classes
    bodyClassList.remove('layout-current', 'layout-option-a', 'layout-option-b', 'layout-option-c', 'layout-option-d');
    
    // Add current layout class
    const newClass = `layout-${currentLayout}`;
    bodyClassList.add(newClass);
    
    return () => {
      // Cleanup on unmount
      bodyClassList.remove('layout-current', 'layout-option-a', 'layout-option-b', 'layout-option-c', 'layout-option-d');
    };
  }, [currentLayout]);

  const setLayout = (layout: LayoutMode) => {
    // Fallback to current layout if container queries aren't supported
    if (layout === 'option-b' && !supportsContainerQueries) {
      console.warn('Container queries not supported, falling back to current layout');
      setCurrentLayout('current');
      return;
    }
    
    setCurrentLayout(layout);
  };

  return (
    <LayoutContext.Provider value={{
      currentLayout,
      setLayout,
      supportsContainerQueries
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
