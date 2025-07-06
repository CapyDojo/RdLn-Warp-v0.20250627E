import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FileText, Image, AlertCircle, Loader, ChevronDown, Languages } from 'lucide-react';
import { useOCR } from '../hooks/useOCR';
import { OCRLanguage } from '../types/ocr-types';
import { LanguageSettingsDropdown } from './LanguageSettingsDropdown';
import { useLayout } from '../contexts/LayoutContext';
import { BaseComponentProps } from '../types/components';

interface TextInputPanelProps extends BaseComponentProps {
  title: string;
  value: string;
  onChange: ((value: string) => void) | ((value: string, isPasteAction?: boolean) => void);
  placeholder: string;
  disabled?: boolean;
  height?: number;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  title,
  value,
  onChange,
  placeholder,
  disabled = false,
  height = 400,
  style,
  className
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const segmentedControlRef = useRef<HTMLDivElement>(null);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [isPasteInProgress, setIsPasteInProgress] = useState(false);
  const [controlRect, setControlRect] = useState<DOMRect | null>(null);
  
  // Detect layout to conditionally apply dynamic scaling behavior
  const { currentLayout } = useLayout();
  const isDynamicScaling = currentLayout === 'option-c' || currentLayout === 'current';
  
  const { 
    isProcessing, 
    progress, 
    error, 
    detectedLanguages,
    selectedLanguages,
    autoDetect,
    supportedLanguages,
    extractTextFromImage, 
    resetOCRState,
    clearDetectedLanguages,
    setSelectedLanguages,
    setAutoDetect
  } = useOCR();

  // Clear detected languages when content is cleared
  useEffect(() => {
    if (!value.trim() && detectedLanguages.length > 0) {
      clearDetectedLanguages();
    }
  }, [value, detectedLanguages.length, clearDetectedLanguages]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    const textItem = items.find(item => item.type.startsWith('text/'));
    
    // Mark that a paste is in progress for regular text
    if (textItem && !imageItem) {
      setIsPasteInProgress(true);
      // Clear the flag after a short delay to catch the onChange event
      setTimeout(() => setIsPasteInProgress(false), 100);
    }
    
    if (imageItem) {
      e.preventDefault();
      
      try {
        const imageFile = imageItem.getAsFile();
        if (!imageFile) return;

        const extractedText = await extractTextFromImage(imageFile);
        
        // Insert extracted text at cursor position or append to existing text
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const currentValue = value;
          
          const newValue = 
            currentValue.substring(0, start) + 
            (start > 0 && currentValue[start - 1] !== '\n' ? '\n\n' : '') +
            extractedText + 
            (end < currentValue.length && currentValue[end] !== '\n' ? '\n\n' : '') +
            currentValue.substring(end);
          
          // Use enhanced onChange to trigger auto-compare
          if (onChange.length > 1) {
            (onChange as (value: string, isPasteAction?: boolean) => void)(newValue, true);
          } else {
            onChange(newValue);
          }
          
          // Set cursor position after inserted text
          setTimeout(() => {
            const newCursorPos = start + extractedText.length + (start > 0 ? 2 : 0);
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
          }, 0);
        } else {
          // Fallback: append to existing text
          const newValue = value + (value ? '\n\n' : '') + extractedText;
          if (onChange.length > 1) {
            (onChange as (value: string, isPasteAction?: boolean) => void)(newValue, true);
          } else {
            onChange(newValue);
          }
        }
      } catch (error) {
        console.error('OCR failed:', error);
      }
    }
    // Regular text paste will be handled by the onChange handler with isPasteInProgress flag
  }, [value, onChange, extractTextFromImage]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      try {
        const extractedText = await extractTextFromImage(imageFile);
        onChange(value + (value ? '\n\n' : '') + extractedText);
      } catch (error) {
        console.error('OCR failed:', error);
      }
    }
  }, [value, onChange, extractTextFromImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleLanguageToggle = (languageCode: OCRLanguage) => {
    if (selectedLanguages.includes(languageCode)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== languageCode));
    } else {
      setSelectedLanguages([...selectedLanguages, languageCode]);
    }
  };

  const getLanguageDisplayName = (languageCode: OCRLanguage) => {
    const lang = supportedLanguages.find(l => l.code === languageCode);
    return lang ? `${lang.flag} ${lang.name}` : languageCode;
  };

  const getLanguageShortName = (languageCode: OCRLanguage) => {
    const lang = supportedLanguages.find(l => l.code === languageCode);
    return lang ? `${lang.flag} ${lang.name.split(' ')[0]}` : languageCode;
  };

  return (
    <div className="glass-panel glass-content-panel overflow-hidden shadow-lg transition-all duration-300">
      <div className="glass-panel-header-footer px-4 py-3 border-b border-theme-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-theme-primary-900" />
          <h3 className="text-lg font-semibold text-theme-primary-900">{title}</h3>
          {isProcessing && (
            <div className="flex items-center gap-2">
              <Loader className="w-4 h-4 text-theme-primary-600 animate-spin" />
              <span className="text-sm text-theme-primary-600">Processing... {progress}%</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Detection Display - Only show when there's content and detected languages */}
          {detectedLanguages.length > 0 && !isProcessing && value.trim() && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-theme-secondary-50 border border-theme-secondary-200 rounded-lg">
              <Languages className="w-4 h-4 text-theme-secondary-600" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-theme-secondary-800">Detected:</span>
                <div className="flex items-center gap-1">
                  {detectedLanguages.slice(0, 3).map((langCode, index) => (
                    <span
                      key={langCode}
                      className="text-xs text-theme-secondary-700"
                      title={getLanguageDisplayName(langCode)}
                    >
                      {getLanguageShortName(langCode)}
                      {index < Math.min(detectedLanguages.length, 3) - 1 && ', '}
                    </span>
                  ))}
                  {detectedLanguages.length > 3 && (
                    <span className="text-xs text-theme-secondary-600">
                      +{detectedLanguages.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* OCR Language Segmented Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-theme-neutral-700 hidden sm:inline">OCR Language</span>
            <div className="segmented-control" ref={segmentedControlRef}>
              <button
                onClick={() => {
                  setAutoDetect(true);
                  setShowLanguageSettings(false); // Always close dropdown when switching to Auto
                }}
                className={`segment ${autoDetect ? 'active' : ''}`}
              >
                Auto
              </button>
              <button
                onClick={() => {
                  if (!autoDetect) {
                    // Already in manual mode, just toggle dropdown
                    setShowLanguageSettings(!showLanguageSettings);
                  } else {
                    // Switching from auto to manual, open dropdown
                    setAutoDetect(false);
                    setShowLanguageSettings(true);
                  }
                  
                  // Update control position for dropdown
                  if (segmentedControlRef.current) {
                    const rect = segmentedControlRef.current.getBoundingClientRect();
                    setControlRect(rect);
                  }
                }}
                className={`segment flex items-center gap-1.5 ${!autoDetect ? 'active' : ''}`}
              >
                Manual
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    showLanguageSettings ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div className={`sliding-indicator ${autoDetect ? 'to-left' : 'to-right'}`}></div>
            </div>
            
            {/* Show dropdown arrow when manual mode */}
          </div>
        </div>
      </div>

      
      <div className="glass-panel-inner-content relative" style={isDynamicScaling ? { minHeight: '200px' } : { height: `${height}px`, minHeight: '200px' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            // Check if this is a paste action (significant content change or isPasteInProgress flag)
            const isLikelyPaste = isPasteInProgress || (newValue.length - value.length > 5);
            
            // Try to call enhanced onChange if it exists, otherwise use regular onChange
            try {
              if (isLikelyPaste) {
                (onChange as (value: string, isPasteAction?: boolean) => void)(newValue, true);
              } else {
                onChange(newValue);
              }
            } catch (error) {
              // Fallback to regular onChange if enhanced version doesn't work
              onChange(newValue);
            }
          }}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          placeholder={isProcessing ? '' : placeholder}
          disabled={disabled || isProcessing}
          className={`glass-input-field w-full py-6 px-8 resize-none focus:ring-2 focus:ring-theme-primary-500 focus:border-transparent font-serif text-theme-neutral-800 leading-relaxed disabled:cursor-not-allowed transition-colors libertinus-math-text border-0 bg-transparent ${
            isDynamicScaling ? '' : 'h-full'
          }`}
          style={isDynamicScaling ? {} : { height: '100%' }}
        />
        
        {/* OCR Progress Bar */}
        {isProcessing && (
          <div className="absolute top-2 left-2 right-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-theme-primary-600" />
              <span className="text-sm font-medium text-theme-neutral-700">
                {progress < 40 ? 'Detecting language...' : 
                 progress < 80 ? 'Extracting text...' : 'Processing text...'}
              </span>
            </div>
            <div className="w-full bg-theme-neutral-200 rounded-full h-2">
              <div 
                className="bg-theme-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {detectedLanguages.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Languages className="w-3 h-3 text-theme-secondary-600" />
                <span className="text-xs text-theme-neutral-600">
                  Detected: {detectedLanguages.map(getLanguageShortName).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* OCR Error */}
        {error && (
          <div className="absolute top-2 left-2 right-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={resetOCRState}
                className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Bottom Status Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          {/* Language Detection Status - Only show when there's content and detected languages */}
          {detectedLanguages.length > 0 && !isProcessing && value.trim() && (
            <div className="flex items-center gap-2 px-2 py-1 bg-transparent border border-white/20 rounded text-xs">
              <Languages className="w-3 h-3 text-theme-secondary-600" />
              <span className="text-theme-secondary-700 font-medium">
                {detectedLanguages.length === 1 
                  ? getLanguageShortName(detectedLanguages[0])
                  : `${detectedLanguages.length} languages`
                }
              </span>
            </div>
          )}
        </div>
        
        {/* OCR Instructions - Only show when not processing and no content */}
        {!value && !isProcessing && (
          <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
            <div className="text-center text-theme-neutral-400 max-w-sm">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-1 font-serif libertinus-math-placeholder">Paste text or screenshot</p>
              
              <p className="text-xs font-serif libertinus-math-placeholder"><i>
                Take a screenshot and paste (Ctrl+V) to</i>   
              </p>
              <p className="text-xs font-serif libertinus-math-placeholder">
                <i>extract text with OCR</i>             
              </p>
              <br></br>
              <p className="text-xs mt-1 text-theme-primary-400 font-serif libertinus-math-placeholder">
                <i>Supports {supportedLanguages.length} languages including Chinese, German, French, Arabic, Japanese, Korean & more</i>
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Language Settings Dropdown */}
      <LanguageSettingsDropdown
        isOpen={!autoDetect && showLanguageSettings}
        onClose={() => setShowLanguageSettings(false)}
        controlRect={controlRect}
        detectedLanguages={detectedLanguages}
        selectedLanguages={selectedLanguages}
        supportedLanguages={supportedLanguages}
        value={value}
        onLanguageToggle={handleLanguageToggle}
        onSetSelectedLanguages={setSelectedLanguages}
        getLanguageDisplayName={getLanguageDisplayName}
      />
    </div>
  );
};
