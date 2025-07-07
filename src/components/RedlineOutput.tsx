import React from 'react';
import { Copy } from 'lucide-react';
import { DiffChange } from '../types';
import { BaseComponentProps } from '../types/components';
import { UI_CONFIG } from '../config/appConfig';
import { useComponentPerformance, usePerformanceAwareHandler } from '../utils/performanceUtils';

interface RedlineOutputProps extends BaseComponentProps {
  changes: DiffChange[];
  onCopy: () => void;
  height?: number;
  isProcessing?: boolean;
  processingStatus?: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

// SSMR: Use centralized configuration for consistent chunk rendering
const { CHUNK_SIZE, ESTIMATED_CHUNK_HEIGHT, INTERSECTION_MARGIN } = UI_CONFIG.RENDERING;

const RedlineOutputBase: React.FC<RedlineOutputProps> = ({
  changes,
  onCopy,
  height = 500,
  isProcessing = false,
  processingStatus = 'Processing...',
  scrollRef,
  style,
  className,
  ...props
}) => {
  // Performance monitoring setup
  const performanceTracker = useComponentPerformance(props, 'RedlineOutput', {
    category: 'output',
    autoTrackRender: true
  });
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Memoize the generated chunks and their HTML strings with performance tracking
  const chunks = React.useMemo(() => {
    const startTime = performance.now();
    
    // Track input metrics
    performanceTracker.trackMetric('changes_count', changes.length);
    
    console.log(`Memoizing ${changes.length} changes into chunks of ${CHUNK_SIZE}`);
    const chunkedChanges = [];
    for (let i = 0; i < changes.length; i += CHUNK_SIZE) {
      chunkedChanges.push(changes.slice(i, i + CHUNK_SIZE));
    }
    
    const result = chunkedChanges.map((chunk, index) => ({
      id: `chunk-${index}`,
      changes: chunk,
      html: generateHTMLString(chunk),
    }));
    
    // Track chunking performance
    const chunkingTime = performance.now() - startTime;
    performanceTracker.trackMetric('chunking_performance', {
      duration: chunkingTime,
      chunkCount: result.length,
      avgChunkSize: changes.length / result.length
    });
    
    return result;
  }, [changes, performanceTracker]);

  const copyToClipboard = usePerformanceAwareHandler(async () => {
    const text = changes.map(change => {
      switch (change.type) {
        case 'changed': return change.revisedContent || '';
        case 'removed': return '';
        default: return change.content;
      }
    }).join('');
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
      performanceTracker.trackMetric('copy_success', { textLength: text.length });
    } catch (err) {
      console.error('Failed to copy text:', err);
      performanceTracker.trackMetric('copy_failure', { error: err.message });
    }
  }, 'copy_to_clipboard', performanceTracker);

  return (
    <div className="glass-panel glass-content-panel overflow-hidden shadow-lg transition-all duration-300">
      <div className="glass-panel-header-footer px-4 py-3 border-b border-theme-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-theme-primary-900">Compared Redline</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-neutral-100 hover:bg-theme-neutral-200 rounded-lg transition-colors"
            title="Copy redlined document to clipboard"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
        </div>
      </div>
      <div
        ref={(el) => {
          scrollContainerRef.current = el;
          if (scrollRef && el) {
            scrollRef.current = el;
          }
        }}
        className="glass-panel-inner-content overflow-y-auto"
        style={{
          height: `${height - 120}px`,
          minHeight: '200px',
        }}
      >
        <div className="glass-input-field font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output libertinus-math-text py-6 px-8">
          {isProcessing ? (
            <div className="mt-4 p-3 bg-theme-primary-50 border border-theme-primary-200 rounded-lg">
              <div className="flex items-center gap-2 text-theme-primary-700">
                <div className="w-4 h-4 border-2 border-theme-primary-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">{processingStatus}</span>
              </div>
            </div>
          ) : (
            chunks.map(chunk => (
              <Chunk
                key={chunk.id}
                html={chunk.html}
                estimatedHeight={ESTIMATED_CHUNK_HEIGHT}
                root={scrollContainerRef.current}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for a single chunk
const Chunk: React.FC<{ html: string, estimatedHeight: number, root: Element | null }> = ({ html, estimatedHeight, root }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const placeholderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { root, rootMargin: INTERSECTION_MARGIN } // Preload chunks before they become visible
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [root]);

  if (isVisible) {
    return (
      <div 
        ref={placeholderRef} 
        className="chunk-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  
  return (
    <div 
      ref={placeholderRef} 
      style={{ height: `${estimatedHeight}px` }}
      className="chunk-container"
    />
  );
};

// Helper function to generate static HTML from changes
const generateHTMLString = (changes: DiffChange[]) => {
  let html = '';
  changes.forEach(change => {
    const escape = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    
    switch (change.type) {
      case 'added':
        html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 border border-theme-secondary-300 underline decoration-2 decoration-theme-secondary-600">${escape(change.content || '')}</span>`;
        break;
      case 'removed':
        html += `<span class="bg-theme-accent-100 text-theme-accent-800 border border-theme-accent-300 line-through decoration-2 decoration-theme-accent-600">${escape(change.content || '')}</span>`;
        break;
      case 'changed':
        html += `<span class="bg-theme-accent-100 text-theme-accent-800 border border-theme-accent-300 line-through decoration-2 decoration-theme-accent-600">${escape(change.originalContent || '')}</span>`;
        html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 border border-theme-secondary-300 underline decoration-2 decoration-theme-secondary-600">${escape(change.revisedContent || '')}</span>`;
        break;
      default:
        html += `<span>${escape(change.content || '')}</span>`;
        break;
    }
  });
  return html;
};

// Main component export
export const RedlineOutput = React.memo(RedlineOutputBase);

