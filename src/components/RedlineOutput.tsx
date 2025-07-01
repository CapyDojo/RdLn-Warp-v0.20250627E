import React from 'react';
import { Copy } from 'lucide-react';
import { DiffChange } from '../types';

interface RedlineOutputProps {
  changes: DiffChange[];
  onCopy: () => void;
  height?: number;
  isProcessing?: boolean;
  processingStatus?: string;
}

// Virtual scrolling configuration - DISABLED (SSMR: Keep static for stability)
const VIRTUAL_THRESHOLD = 999999; // Virtual scrolling disabled - static rendering preferred
const SEMANTIC_CHUNK_SIZE = 200; // Preserved for future semantic chunking
const CHUNK_HEIGHT = 300; // Preserved for future virtual scrolling
const BUFFER_CHUNKS = 2; // Preserved for future virtual scrolling

const RedlineOutputBase: React.FC<RedlineOutputProps> = ({ 
  changes, 
  onCopy, 
  height = 500,
  isProcessing = false,
  processingStatus = 'Processing...'
}) => {
  console.log('🔍 Step 1: Component function started');
  
  // Virtual scrolling state
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(height - 120);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Use virtual scrolling only for large change sets AND when processing is complete
  const useVirtualScrolling = !isProcessing && changes.length > VIRTUAL_THRESHOLD;

  // Performance monitoring
  React.useEffect(() => {
    if (useVirtualScrolling) {
      console.log('🚀 Using virtual scrolling for large change set:', changes.length);
    } else {
      console.log('📄 Rendering small change set directly:', changes.length);
    }
  }, [changes.length, useVirtualScrolling]);
  
  // Chunk-based virtual scrolling calculations
  const { visibleChunks, totalHeight, startChunkIndex } = React.useMemo(() => {
    if (!useVirtualScrolling) {
      return {
        visibleChunks: [changes],
        totalHeight: 0,
        startChunkIndex: 0
      };
    }
    
    const totalChunks = Math.ceil(changes.length / SEMANTIC_CHUNK_SIZE);
    const startChunk = Math.floor(scrollTop / CHUNK_HEIGHT);
    const visibleChunkCount = Math.ceil(containerHeight / CHUNK_HEIGHT) + BUFFER_CHUNKS * 2;
    const startWithBuffer = Math.max(0, startChunk - BUFFER_CHUNKS);
    const endWithBuffer = Math.min(totalChunks - 1, startChunk + visibleChunkCount);
    
    const chunks = [];
    for (let i = startWithBuffer; i <= endWithBuffer; i++) {
      const start = i * SEMANTIC_CHUNK_SIZE;
      const end = Math.min(start + SEMANTIC_CHUNK_SIZE, changes.length);
      chunks.push(changes.slice(start, end));
    }
    
    return {
      visibleChunks: chunks,
      totalHeight: totalChunks * CHUNK_HEIGHT,
      startChunkIndex: startWithBuffer
    };
  }, [changes, scrollTop, containerHeight, useVirtualScrolling]);
  
  // Smooth scroll handler with requestAnimationFrame throttling
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    // Always update scroll position - no dead zones
    setScrollTop(newScrollTop);
  }, []);
  
  // Update container height when component resizes
  React.useEffect(() => {
    setContainerHeight(height - 120);
  }, [height]);

  // Performance monitoring for virtual scrolling
  React.useLayoutEffect(() => {
    if (useVirtualScrolling) {
      const totalVisibleItems = visibleChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      console.log('🖼️ Virtual viewport updated:', {
        visibleChunks: visibleChunks.length,
        visibleItems: totalVisibleItems,
        startChunkIndex,
        totalChanges: changes.length
      });
    }
  }, [visibleChunks.length, startChunkIndex, useVirtualScrolling, changes.length]);

  const renderChange = (change: DiffChange, originalIndex: number) => {
    const key = `${change.type}-${originalIndex}`;
    
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
          <span key={key}>
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

  // Generate HTML string for chunk (avoiding React element overhead)
  const generateChunkHTML = (chunk: DiffChange[]) => {
    let html = '';
    
    chunk.forEach((change) => {
      const content = change.content || '';
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
      
      switch (change.type) {
        case 'added':
          html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escapedContent}</span>`;
          break;
        case 'removed':
          html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escapedContent}</span>`;
          break;
        case 'changed':
          const escapedOriginal = (change.originalContent || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          const escapedRevised = (change.revisedContent || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escapedOriginal}</span><span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escapedRevised}</span>`;
          break;
        case 'unchanged':
        default:
          html += `<span class="text-theme-neutral-800">${escapedContent}</span>`;
          break;
      }
    });
    
    return html;
  };

  // Main thread blocking detection (only for virtual scrolling monitoring)
  React.useEffect(() => {
    if (!useVirtualScrolling) return;
    
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const checkForBlocking = () => {
      const currentTime = performance.now();
      const timeDelta = currentTime - lastTime;
      
      // If more than 50ms has passed since last frame, the main thread was likely blocked
      if (timeDelta > 50) {
        const totalVisibleItems = visibleChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        console.warn('🚨 MAIN THREAD BLOCKING DETECTED:', {
          blockingDuration: timeDelta.toFixed(2) + 'ms',
          timestamp: currentTime,
          changesLength: changes.length,
          visibleItems: totalVisibleItems,
          virtualScrolling: useVirtualScrolling
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
  }, [changes.length, visibleChunks, useVirtualScrolling]);

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

  // PERFORMANCE FIX: Generate HTML string for large diffs to avoid React overhead
  // CACHE: Prevent expensive re-generation during React StrictMode double-mounting
  const htmlCache = React.useRef<{changes: DiffChange[], html: string} | null>(null);
  
  const generateHTMLString = React.useCallback((changes: DiffChange[]) => {
    // Check cache first
    if (htmlCache.current && htmlCache.current.changes === changes) {
      console.info('🚀 CACHE HIT: Using cached HTML string', htmlCache.current.html.length, 'chars');
      return htmlCache.current.html;
    }
    
    console.info('🔄 GENERATING HTML: Building string for', changes.length, 'changes...');
    const startTime = performance.now();
    
    let html = '';
    
    changes.forEach((change) => {
      const content = change.content || '';
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
      
      switch (change.type) {
        case 'added':
          html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escapedContent}</span>`;
          break;
        case 'removed':
          html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escapedContent}</span>`;
          break;
        case 'changed':
          const escapedOriginal = (change.originalContent || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          const escapedRevised = (change.revisedContent || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escapedOriginal}</span><span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escapedRevised}</span>`;
          break;
        case 'unchanged':
        default:
          html += `<span class="text-theme-neutral-800">${escapedContent}</span>`;
          break;
      }
    });
    
    const endTime = performance.now();
    console.info('✅ HTML GENERATION COMPLETE:', {
      htmlLength: html.length,
      generationTime: (endTime - startTime) + 'ms',
      changesCount: changes.length
    });
    
    // Cache the result
    htmlCache.current = { changes, html };
    
    return html;
  }, []);

  // SSMR STEP 3: FREEZE COMPLETED DIFFS TO STATIC HTML FOR PERFORMANCE
  // Safe: Only freeze when processing is complete and content won't change
  // Modular: Can be disabled by setting ENABLE_FREEZING = false
  // Reversible: Easy rollback by changing shouldFreeze condition
  const ENABLE_FREEZING = true; // ROLLBACK: Set to false to disable freezing
  const FREEZE_THRESHOLD = 0; // SSMR TEST: Freeze ALL completed diffs for maximum resize performance
  
  const shouldFreeze = ENABLE_FREEZING && 
                      !isProcessing && 
                      changes.length > FREEZE_THRESHOLD;
  
  // SSMR STEP 7: Direct execution instead of useEffect (which wasn't working)
  console.info('🔥🔥🔥 REDLINE OUTPUT COMPONENT RENDERED 🔥🔥🔥');
  console.info('🟢 DEFINITIVE DEBUG: RedlineOutput render detected with', changes.length, 'changes');
  console.info('🟢 ENABLE_FREEZING:', ENABLE_FREEZING);
  console.info('🟢 FREEZE_THRESHOLD:', FREEZE_THRESHOLD);
  console.info('🟢 isProcessing:', isProcessing);
  console.info('🟢 changes.length:', changes.length);
  console.info('🟢 changes.length > FREEZE_THRESHOLD:', changes.length > FREEZE_THRESHOLD);
  console.info('🟢 !isProcessing:', !isProcessing);
  console.info('🟢 shouldFreeze:', shouldFreeze, 'isProcessing:', isProcessing, 'threshold:', FREEZE_THRESHOLD);
  console.info('🟢 Actual values: changes.length:', changes.length, 'isProcessing:', isProcessing);
  
  // TEMPORARY: Debug console visibility issue
  if (typeof window !== 'undefined' && changes.length > 100000) {
    window.console.log('🚨 CONSOLE TEST: This should appear in console with', changes.length, 'changes');
    window.console.error('🚨 CONSOLE TEST: Error log should appear in console');
    window.console.warn('🚨 CONSOLE TEST: Warning log should appear in console');
  }
  
  // DEBUGGING CONFIRMED: RedlineOutput renders correctly with freeze mechanism working
  // Alert showed: shouldFreeze: true for 188,131 changes
  // Issue is React re-renders during resize, not freeze mechanism failure
  
  if (shouldFreeze) {
    console.info('🧊🧊🧊 FREEZE ACTIVATED! Static HTML rendering for MAXIMUM performance 🧊🧊🧊');
    console.error('🧊 FREEZE ERROR LOG: Activated for visibility');
    console.warn('🧊 FREEZE WARN LOG: Activated for visibility');
    
    // Verify HTML generation
    const htmlString = generateHTMLString(changes);
    const htmlLength = htmlString.length;
    const htmlPreview = htmlString.substring(0, 100) + '...';
    
    console.info('🌐 FREEZE HTML GENERATED:', {
      htmlLength,
      htmlPreview,
      changesCount: changes.length,
      timestamp: performance.now()
    });
  } else if (isProcessing) {
    console.info('⚛️ PROCESSING: Using React elements for processing state');
  } else {
    console.info('⚛️ SMALL DOC: Using React elements for small diff (', changes.length, 'changes, threshold:', FREEZE_THRESHOLD, ')');
  }

  return (
    <div className="glass-panel overflow-hidden shadow-lg transition-all duration-300">
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
      <div 
        ref={scrollContainerRef}
        className="glass-panel-inner-content p-6 overflow-y-auto" 
        style={{ 
          height: `${height - 120}px`, 
          minHeight: '200px',
          // SSMR PERFORMANCE: GPU rendering optimizations to prevent layout during resize
          willChange: 'transform', // Hint browser for GPU acceleration
          transform: 'translate3d(0, 0, 0)', // Force GPU layer
          backfaceVisibility: 'hidden', // Optimize rendering
          perspective: '1000px', // Enable 3D context
          // SSMR Step 2: CSS content-visibility optimization for layout performance
          contentVisibility: 'auto',
          containIntrinsicSize: '1000px'
        }}
        onScroll={useVirtualScrolling ? handleScroll : undefined}
      >
        {useVirtualScrolling ? (
          // Virtual scrolling implementation with chunks
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div 
              style={{ 
                transform: `translateY(${startChunkIndex * CHUNK_HEIGHT}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }}
            >
              <div className="font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output">
                {visibleChunks.map((chunk, chunkIndex) => (
                  <div key={`chunk-${startChunkIndex + chunkIndex}`} style={{ minHeight: CHUNK_HEIGHT }}>
                    {chunk.map((change, itemIndex) => {
                      const originalIndex = (startChunkIndex + chunkIndex) * SEMANTIC_CHUNK_SIZE + itemIndex;
                      return renderChange(change, originalIndex);
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // SSMR STEP 3: Conditional rendering based on freeze state
          <div className="font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output">
            {shouldFreeze ? (
              // 🧊 FROZEN: Static HTML for completed large diffs (MAXIMUM performance during resize)
              (() => {
                console.info('🔥 FREEZE PATH EXECUTING: Rendering static HTML via dangerouslySetInnerHTML');
                const htmlContent = generateHTMLString(changes);
                console.info('🔥 FREEZE HTML LENGTH:', htmlContent.length);
                return <div 
                  data-freeze-indicator="true" 
                  data-changes-count={changes.length}
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />;
              })()
            ) : (
              // ⚛️ LIVE: React elements for processing states and small diffs
              (() => {
                console.info('⚛️ LIVE PATH EXECUTING: Rendering React elements');
                return changes.map((change, index) => renderChange(change, index));
              })()
            )}
            {isProcessing && (
              <div className="mt-4 p-3 bg-theme-primary-50 border border-theme-primary-200 rounded-lg">
                <div className="flex items-center gap-2 text-theme-primary-700">
                  <div className="w-4 h-4 border-2 border-theme-primary-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">{processingStatus}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="glass-panel-header-footer px-4 py-2 border-t border-theme-neutral-200 text-xs text-theme-neutral-600">
        <div className="flex justify-between items-center">
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
          {useVirtualScrolling && (
            <div className="text-theme-neutral-500">
              Virtual scrolling: {visibleChunks.reduce((sum, chunk) => sum + chunk.length, 0)} of {changes.length} visible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// SSMR MEMOIZATION: Wrap component with React.memo for performance
// SAFE: Only re-renders when actual props change (changes, height, isProcessing)
// MODULAR: Can be disabled by setting ENABLE_MEMOIZATION = false
// REVERSIBLE: Easy rollback by exporting RedlineOutputBase directly
const ENABLE_MEMOIZATION = true; // ROLLBACK: Set to false to disable

export const RedlineOutput = ENABLE_MEMOIZATION ? React.memo(RedlineOutputBase, (prevProps, nextProps) => {
  // Custom comparison function for performance debugging
  const changesEqual = prevProps.changes === nextProps.changes;
  const heightEqual = prevProps.height === nextProps.height;
  const processingEqual = prevProps.isProcessing === nextProps.isProcessing;
  const statusEqual = prevProps.processingStatus === nextProps.processingStatus;
  const copyEqual = prevProps.onCopy === nextProps.onCopy;
  
  const shouldSkipRender = changesEqual && heightEqual && processingEqual && statusEqual && copyEqual;
  
  // Debug logging for performance analysis (RE-ENABLED for systematic debugging)
  if (!shouldSkipRender) {
    console.log('🔄 RedlineOutput re-rendering due to prop changes:', {
      changesEqual,
      processingEqual,
      statusEqual,
      copyEqual,
      changesLength: nextProps.changes.length
    });
  } else {
    console.log('⚡ RedlineOutput SKIPPED re-render (memoized)', {
      changesLength: nextProps.changes.length
    });
  }
  
  return shouldSkipRender;
}) : RedlineOutputBase;
