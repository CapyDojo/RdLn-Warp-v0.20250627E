import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FileText, Image, AlertCircle, Loader, Settings, Globe, ChevronDown, Languages } from 'lucide-react';
import { useOCR } from '../hooks/useOCR';
import { OCRLanguage } from '../utils/OCRService';

interface TextInputPanelProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  title,
  value,
  onChange,
  placeholder,
  disabled = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  
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
          
          onChange(newValue);
          
          // Set cursor position after inserted text
          setTimeout(() => {
            const newCursorPos = start + extractedText.length + (start > 0 ? 2 : 0);
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
          }, 0);
        } else {
          // Fallback: append to existing text
          onChange(value + (value ? '\n\n' : '') + extractedText);
        }
      } catch (error) {
        console.error('OCR failed:', error);
      }
    }
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-theme-neutral-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-theme-primary-900" />
          <h2 className="text-lg font-semibold text-theme-primary-900">{title}</h2>
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
          
          <button
            onClick={() => setShowLanguageSettings(!showLanguageSettings)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-neutral-100 hover:bg-theme-neutral-200 rounded-lg transition-colors"
            title="OCR Language Settings"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Languages</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageSettings ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Language Settings Panel */}
      {showLanguageSettings && (
        <div className="mb-4 p-4 bg-theme-neutral-50 rounded-lg border border-theme-neutral-200">
          <div className="space-y-4">
            {/* Auto-detect toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-theme-neutral-700">Auto-detect Language</label>
                <p className="text-xs text-theme-neutral-500">Automatically detect document language</p>
              </div>
              <button
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoDetect ? 'bg-theme-primary-600' : 'bg-theme-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoDetect ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Detected Languages - Enhanced Display - Only show when there's content */}
            {detectedLanguages.length > 0 && value.trim() && (
              <div>
                <label className="text-sm font-medium text-theme-neutral-700 mb-2 block">
                  Detected Languages ({detectedLanguages.length})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {detectedLanguages.map((langCode, index) => (
                    <div
                      key={langCode}
                      className="flex items-center gap-2 px-3 py-2 bg-theme-secondary-100 border border-theme-secondary-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium text-theme-secondary-800">
                          {getLanguageDisplayName(langCode)}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="text-xs bg-theme-secondary-200 text-theme-secondary-800 px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-theme-neutral-600 mt-2">
                  Languages are listed in order of detection confidence. Primary language is used for specialized text processing.
                </p>
              </div>
            )}

            {/* Manual Language Selection */}
            {!autoDetect && (
              <div>
                <label className="text-sm font-medium text-theme-neutral-700 mb-2 block">
                  Select Languages ({selectedLanguages.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {supportedLanguages.map(language => (
                    <label
                      key={language.code}
                      className="flex items-center gap-2 p-2 hover:bg-theme-neutral-100 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language.code)}
                        onChange={() => handleLanguageToggle(language.code)}
                        className="rounded border-theme-neutral-300 text-theme-primary-600 focus:ring-theme-primary-500"
                      />
                      <span className="text-sm">
                        {language.flag} {language.name}
                      </span>
                      <span className="text-xs text-theme-neutral-500 ml-auto">
                        {language.downloadSize}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Language Presets */}
            <div>
              <label className="text-sm font-medium text-theme-neutral-700 mb-2 block">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLanguages(['eng'])}
                  className="px-3 py-1 text-xs bg-theme-primary-100 text-theme-primary-800 rounded-full hover:bg-theme-primary-200 transition-colors"
                >
                  English Only
                </button>
                <button
                  onClick={() => setSelectedLanguages(['eng', 'chi_sim', 'chi_tra'])}
                  className="px-3 py-1 text-xs bg-theme-primary-100 text-theme-primary-800 rounded-full hover:bg-theme-primary-200 transition-colors"
                >
                  English + Chinese
                </button>
                <button
                  onClick={() => setSelectedLanguages(['eng', 'spa', 'fra'])}
                  className="px-3 py-1 text-xs bg-theme-primary-100 text-theme-primary-800 rounded-full hover:bg-theme-primary-200 transition-colors"
                >
                  English + European
                </button>
                <button
                  onClick={() => setSelectedLanguages(['eng', 'jpn', 'kor'])}
                  className="px-3 py-1 text-xs bg-theme-primary-100 text-theme-primary-800 rounded-full hover:bg-theme-primary-200 transition-colors"
                >
                  English + Asian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          placeholder={isProcessing ? '' : placeholder}
          disabled={disabled || isProcessing}
          className="glass-input-field w-full h-full p-4 rounded-lg resize-none focus:ring-2 focus:ring-theme-primary-500 focus:border-transparent font-serif text-theme-neutral-800 leading-relaxed disabled:cursor-not-allowed transition-colors libertinus-math-text"
          style={{ minHeight: '400px' }}
        />
        
        {/* OCR Progress Bar */}
        {isProcessing && (
          <div className="absolute top-2 left-2 right-2 glass-panel p-3">
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
            <div className="flex items-center gap-2 px-2 py-1 glass-panel text-xs">
              <Languages className="w-3 h-3 text-theme-secondary-600" />
              <span className="text-theme-secondary-700 font-medium">
                {detectedLanguages.length === 1 
                  ? getLanguageShortName(detectedLanguages[0])
                  : `${detectedLanguages.length} languages`
                }
              </span>
            </div>
          )}
          
          <div className="text-xs text-theme-neutral-500 glass-panel px-2 py-1 ml-auto">
            {value.length.toLocaleString()} characters
          </div>
        </div>
        
        {/* OCR Instructions - Only show when not processing and no content */}
        {!value && !isProcessing && (
          <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
            <div className="text-center text-theme-neutral-400 max-w-sm">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-1 font-serif libertinus-math-placeholder">Paste text or images</p>
              <p className="text-xs font-serif libertinus-math-placeholder">
                Take a screenshot and paste (Ctrl+V) to automatically extract text using OCR
              </p>
              <p className="text-xs mt-1 text-theme-primary-400 font-serif libertinus-math-placeholder">
                Supports {supportedLanguages.length} languages including Chinese, Japanese, Korean, Arabic & more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};