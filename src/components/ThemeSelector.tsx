import React from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDropdown } from '../hooks/useDropdown';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { isOpen, toggle, referenceRef, popperRef } = useDropdown();
  
  // Only initialize usePopper when both refs are available
  const [enablePopper, setEnablePopper] = React.useState(false);
  
  // Check if both refs are available
  React.useLayoutEffect(() => {
    if (referenceRef.current && popperRef.current && isOpen) {
      setEnablePopper(true);
    } else if (!isOpen) {
      setEnablePopper(false);
    }
  }, [isOpen, referenceRef.current, popperRef.current]);
  
  const { styles, attributes, update } = usePopper(
    enablePopper ? referenceRef.current : null,
    enablePopper ? popperRef.current : null,
    {
      placement: 'bottom-end',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport',
            padding: 8,
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top-end', 'bottom-start', 'top-start'],
          },
        },
      ],
    }
  );

  // Force update popper position when enabled
  React.useLayoutEffect(() => {
    if (enablePopper && update) {
      update();
    }
  }, [enablePopper, update]);

  const handleSelectTheme = (themeName: string) => {
    setTheme(themeName);
  };

  return (
    <>
      <button
        ref={referenceRef as React.RefObject<HTMLButtonElement>}
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-2 bg-theme-primary-100 hover:bg-theme-primary-200 rounded-lg transition-all duration-200 text-theme-primary-800 shadow-lg shrink-0"
        title="Change Theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline whitespace-nowrap">Theme</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div
          ref={popperRef as React.RefObject<HTMLDivElement>}
          style={styles.popper}
          {...attributes.popper}
          className="glass-panel rounded-xl shadow-xl z-[9999] min-w-[240px] overflow-hidden border border-white/20"
        >
          <div className="p-2">
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleSelectTheme(theme.name)}
                className={`w-full px-4 py-3 text-left rounded-lg flex items-center justify-between group transition-all duration-200 ${
                  currentTheme === theme.name
                    ? 'bg-theme-primary-500/20'
                    : 'hover:bg-white/30'
                } text-body`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{theme.displayName}</div>
                  <div className="text-sm opacity-70 truncate">{theme.description}</div>
                </div>
                {currentTheme === theme.name && (
                  <Check className="w-5 h-5 text-theme-primary-600 shrink-0 ml-3" />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
