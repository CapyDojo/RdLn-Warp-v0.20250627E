import React from 'react';
import { Copy, Download } from 'lucide-react';
import { DiffChange } from '../types';

interface RedlineOutputProps {
  changes: DiffChange[];
  onCopy: () => void;
}

export const RedlineOutput: React.FC<RedlineOutputProps> = ({ changes, onCopy }) => {
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
      
      <div className="glass-panel-inner-content p-6 max-h-96 overflow-y-auto">
        <div className="font-serif text-theme-neutral-800 leading-relaxed whitespace-pre-wrap libertinus-math-output">
          {changes.map((change, index) => renderChange(change, index))}
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