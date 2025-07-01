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

// SSMR: Chunked Static Rendering Implementation
const CHUNK_SIZE = 1000; // Render 1000 changes per chunk
const ESTIMATED_CHUNK_HEIGHT = 5000; // Estimated px height for a chunk for the scrollbar

const RedlineOutputBase: React.FC<RedlineOutputProps> = ({
  changes,
  onCopy,
  height = 500,
  isProcessing = false,
  processingStatus = 'Processing...'
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Memoize the generated chunks and their HTML strings
  const chunks = React.useMemo(() => {
    console.log(`Memoizing ${changes.length} changes into chunks of ${CHUNK_SIZE}`);
    const chunkedChanges = [];
    for (let i = 0; i < changes.length; i += CHUNK_SIZE) {
      chunkedChanges.push(changes.slice(i, i + CHUNK_SIZE));
    }
    return chunkedChanges.map((chunk, index) => ({
      id: `chunk-${index}`,
      changes: chunk,
      html: generateHTMLString(chunk),
    }));
  }, [changes]);

  const copyToClipboard = async () => {
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
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

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
        }}
      >
        <div className="font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output">
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
          </div>
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
      { root, rootMargin: '200px' } // Preload chunks 200px before they become visible
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [root]);

  return (
    <div ref={placeholderRef} style={{ minHeight: isVisible ? 'auto' : `${estimatedHeight}px` }}>
      {isVisible && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
};

// Helper function to generate static HTML from changes
const generateHTMLString = (changes: DiffChange[]) => {
  let html = '';
  changes.forEach(change => {
    const escape = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    
    switch (change.type) {
      case 'added':
        html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escape(change.content || '')}</span>`;
        break;
      case 'removed':
        html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escape(change.content || '')}</span>`;
        break;
      case 'changed':
        html += `<span class="bg-theme-accent-100 text-theme-accent-800 line-through decoration-2 decoration-theme-accent-600">${escape(change.originalContent || '')}</span>`;
        html += `<span class="bg-theme-secondary-100 text-theme-secondary-800 underline decoration-2 decoration-theme-secondary-600">${escape(change.revisedContent || '')}</span>`;
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

