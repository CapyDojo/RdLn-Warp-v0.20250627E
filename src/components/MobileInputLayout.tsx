import React from 'react';
import { GripVertical } from 'lucide-react';
import { TextInputPanel } from './TextInputPanel';

interface MobileInputLayoutProps {
  /** Original text content */
  originalText: string;
  /** Revised text content */
  revisedText: string;
  /** Whether currently processing */
  isProcessing: boolean;
  /** Panel height for fallback React state */
  panelHeight: number;
  /** Whether to use CSS-based resize */
  USE_CSS_RESIZE: boolean;
  /** Callback for original text changes */
  onOriginalTextChange: (value: string, isPasteAction?: boolean) => void;
  /** Callback for revised text changes */
  onRevisedTextChange: (value: string, isPasteAction?: boolean) => void;
  /** Panel resize handlers from hook */
  panelResizeHandlers: {
    handleMouseDown: (e: React.MouseEvent) => void;
    desktopInputPanelsRef: React.RefObject<HTMLDivElement>;
    mobileInputPanelsRef: React.RefObject<HTMLDivElement>;
  };
  /** Mobile resize handle ref */
  mobileResizeHandleRef: React.RefObject<HTMLDivElement>;
}

/**
 * Mobile Input Layout Component
 * 
 * Handles the stacked mobile layout with resize handle between panels.
 * Extracted from ComparisonInterface for better modularity and mobile customization.
 * 
 * Features:
 * - Stacked input panels with resize handle between them
 * - Character count display in resize handle
 * - Hover effects for visual feedback
 * - Integrated with useResizeHandlers hook
 */
export const MobileInputLayout: React.FC<MobileInputLayoutProps> = ({
  originalText,
  revisedText,
  isProcessing,
  panelHeight,
  USE_CSS_RESIZE,
  onOriginalTextChange,
  onRevisedTextChange,
  panelResizeHandlers,
  mobileResizeHandleRef
}) => {
  return (
    <div className="block lg:hidden">
      <div ref={panelResizeHandlers.mobileInputPanelsRef} className="space-y-4">
        <div data-input-panel>
          <TextInputPanel
            title="Original Version"
            value={originalText}
            onChange={onOriginalTextChange}
            placeholder="Paste your original legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
            disabled={isProcessing}
            height={USE_CSS_RESIZE ? 9999 : panelHeight}
          />
        </div>
        
        {/* Mobile Handle - Between panels */}
        <div className="flex justify-center">
          <div className="glass-panel bg-theme-neutral-200/60 hover:bg-theme-neutral-300/70 rounded-lg transition-all duration-300 backdrop-blur-md border border-theme-neutral-300/30 shadow-sm hover:shadow-md px-2 py-1">
            {/* Mobile layout: vertical */}
            <div className="flex flex-col items-center gap-2">
              {/* Original character count */}
              <div className="text-xs text-theme-neutral-600 whitespace-nowrap">
                <span className="font-medium">Original:</span> {originalText.length.toLocaleString()} chars
              </div>
              
              {/* Resize handle grip */}
              <div
                data-resize-handle="input-panels"
                ref={mobileResizeHandleRef}
                className="flex items-center justify-center w-6 h-12 cursor-col-resize touch-none select-none"
                onMouseDown={panelResizeHandlers.handleMouseDown}
                onMouseEnter={() => {
                  // Apply hover effects to input panels - same as handle bar
                  const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel');
                  inputPanels.forEach(panel => {
                    const element = panel as HTMLElement;
                    // Apply same hover state as the handle bar
                    element.classList.add('hover-from-handle');
                    element.style.transform = 'translateY(-1px)';
                    element.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
                  });
                }}
                onMouseLeave={() => {
                  // Remove hover effects from input panels
                  const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel');
                  inputPanels.forEach(panel => {
                    const element = panel as HTMLElement;
                    element.classList.remove('hover-from-handle');
                    element.style.transform = '';
                  });
                }}
                title="Drag to resize input panels"
              >
                <GripVertical className="w-6 h-6 text-theme-neutral-700" />
              </div>
              
              {/* Revised character count */}
              <div className="text-xs text-theme-neutral-600 whitespace-nowrap">
                <span className="font-medium">Revised:</span> {revisedText.length.toLocaleString()} chars
              </div>
            </div>
          </div>
        </div>
        
        <div data-input-panel>
          <TextInputPanel
            title="Revised Version"
            value={revisedText}
            onChange={onRevisedTextChange}
            placeholder="Paste your revised legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
            disabled={isProcessing}
            height={USE_CSS_RESIZE ? 9999 : panelHeight}
          />
        </div>
      </div>
    </div>
  );
};
