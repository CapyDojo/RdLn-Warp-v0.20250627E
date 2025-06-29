import React from 'react';
import { Copy, Download } from 'lucide-react';
import { DiffChange } from '../types';

interface RedlineOutputProps {
  changes: DiffChange[];
  onCopy: () => void;
  height?: number;
}

export const RedlineOutput: React.FC<RedlineOutputProps> = ({ changes, onCopy, height = 500 }) => {
  // Progressive rendering state for large change sets
  const [renderedCount, setRenderedCount] = React.useState(0);
  const [isProgressiveRendering, setIsProgressiveRendering] = React.useState(false);
  
  // Progressive rendering configuration
  const PROGRESSIVE_THRESHOLD = 1000; // Start progressive rendering above 1000 changes
  const RENDER_CHUNK_SIZE = 200; // Render 200 changes per chunk
  const RENDER_DELAY = 16; // 16ms delay between chunks (60fps)
  
  // 🎯 COMPREHENSIVE PERFORMANCE LOGGING TO IDENTIFY LAG SOURCE
  const performanceStartTime = React.useRef(performance.now());
  const componentRenderStartTime = React.useRef(performance.now());
  
  console.log('🎨 RedlineOutput COMPONENT RENDER START:', {
    changesLength: changes.length,
    timestamp: performance.now(),
    memoryUsage: (performance as any).memory ? {
      usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024) + 'MB'
    } : 'unavailable'
  });
  
  // DEBUG: Log rendering performance for large change sets
  React.useEffect(() => {
    console.log('🎨 RedlineOutput rendering:', {
      changesLength: changes.length,
      timestamp: new Date().toISOString()
    });
    
    if (changes.length > PROGRESSIVE_THRESHOLD) {
      console.warn('⚠️ Large change set detected - enabling progressive rendering:', changes.length);
      setIsProgressiveRendering(true);
      setRenderedCount(0);
      
      // Start progressive rendering
      const renderNextChunk = () => {
        setRenderedCount(prev => {
          const nextCount = Math.min(prev + RENDER_CHUNK_SIZE, changes.length);
          
          if (nextCount < changes.length) {
            // Schedule next chunk
            setTimeout(renderNextChunk, RENDER_DELAY);
          } else {
            // Rendering complete
            console.log('✅ Progressive rendering complete');
            setIsProgressiveRendering(false);
          }
          
          if (nextCount >= changes.length) {
            console.log('✅ Progressive rendering fully completed:', changes.length);
            console.timeEnd('Progressive Rendering Timer');
          }
          return nextCount;
        });
      };
      
      console.time('Progressive Rendering Timer');
      console.log('🔄 Starting progressive rendering...');
      // Start with first chunk after a brief delay
      setTimeout(renderNextChunk, RENDER_DELAY);
    } else {
      console.log('🔍 Rendering small change set all at once:', changes.length);
      // Small change set - render all at once
      setRenderedCount(changes.length);
      setIsProgressiveRendering(false);
      console.timeEnd('RedlineOutput Render Time');
    }
  }, [changes.length]);
  
  // 📊 Track component lifecycle performance
  React.useLayoutEffect(() => {
    console.log('🎨 RedlineOutput LAYOUT EFFECT START:', performance.now());
    return () => {
      console.log('🎨 RedlineOutput LAYOUT EFFECT CLEANUP:', performance.now());
    };
  }, [changes]);
  
  React.useEffect(() => {
    const endTime = performance.now();
    console.log('🎨 RedlineOutput COMPONENT RENDER COMPLETE:', {
      totalRenderTime: (endTime - componentRenderStartTime.current).toFixed(2) + 'ms',
      timestamp: endTime,
      changesRendered: renderedCount,
      totalChanges: changes.length
    });
  }, [renderedCount]);
  
  // 🎯 Add DOM manipulation tracking
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const renderChange = (change: DiffChange, index: number) => {
    const key = `${change.type}-${index}`;
    
    switch (change.type) {
      case 'added':
        return (
          <span key={key} className="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">
            {change.content}
          </span>
        );
      case 'removed':
        return (
          <span key={key} className="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">
            {change.content}
          </span>
        );
      case 'changed':
        return (
          <span key={key} className="inline">
            <span className="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">
              {change.originalContent}
            </span>
            <span className="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">
              {change.revisedContent}
            </span>
          </span>
        );
      case 'unchanged':
        return (
          <span key={key} className="text-theme-neutral-800">
            {change.content}
          </span>
        );
      default:
        return null;
    }
  };

  const copyToClipboard = async () => {
    // For copy functionality, we need to reconstruct the text properly
    const text = changes.map(change => {
      switch (change.type) {
        case 'changed':
          return change.revisedContent || '';
        case 'removed':
          return ''; // Don't include removed content in final text
        default:
          return change.content;
      }
    }).join('');
    
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // 🎯 BROWSER THREAD BLOCKING DETECTION
  React.useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const checkForBlocking = () => {
      const currentTime = performance.now();
      const timeDelta = currentTime - lastTime;
      
      // If more than 50ms has passed since last frame, the main thread was likely blocked
      if (timeDelta > 50) {
        console.warn('🚨 MAIN THREAD BLOCKING DETECTED:', {
          blockingDuration: timeDelta.toFixed(2) + 'ms',
          timestamp: currentTime,
          changesLength: changes.length,
          renderedCount: renderedCount
        });
      }
      
      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(checkForBlocking);
    };
    
    animationFrameId = requestAnimationFrame(checkForBlocking);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [changes.length, renderedCount]);
  
  // 🎯 DOM RENDER TIMING
  React.useLayoutEffect(() => {
    const renderStartTime = performance.now();
    console.log('🎨 DOM LAYOUT START:', renderStartTime);
    
    return () => {
      const renderEndTime = performance.now();
      console.log('🎨 DOM LAYOUT END:', {
        duration: (renderEndTime - renderStartTime).toFixed(2) + 'ms',
        timestamp: renderEndTime
      });
    };
  }, [renderedCount]);
  
  return (
    <div ref={containerRef} className="glass-panel overflow-hidden shadow-lg transition-all duration-300">
      <div className="glass-panel-header-footer px-4 py-3 border-b border-theme-neutral-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-theme-primary-900">Redlined Document</h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="enhanced-button flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-primary-600 text-white rounded hover:bg-theme-primary-700 transition-all duration-200 shadow-lg"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>
      
      <div className="glass-panel-inner-content p-6 overflow-y-auto" style={{ height: `${height - 120}px`, minHeight: '200px' }}>
        <div className="font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output">
          {changes.slice(0, renderedCount).map((change, index) => renderChange(change, index))}
          {isProgressiveRendering && (
            <div className="inline-flex items-center gap-2 text-theme-primary-600 text-sm mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-theme-primary-600"></div>
              <span>Rendering... {Math.round((renderedCount / changes.length) * 100)}% ({renderedCount}/{changes.length})</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-panel-header-footer px-4 py-2 border-t border-theme-neutral-200 text-xs text-theme-neutral-600">
        <div className="flex gap-6">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-theme-secondary-100 border border-theme-secondary-300 rounded"></span>
            Additions
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-theme-accent-100 border border-theme-accent-300 rounded"></span>
            Deletions
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-theme-accent-100 border border-theme-accent-300 rounded"></span>
            Changes (substitutions)
          </span>
        </div>
      </div>
    </div>
  );
};