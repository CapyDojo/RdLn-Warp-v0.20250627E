/**
 * Reusable dropdown hook for consistent dropdown behavior
 */

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseDropdownProps {
  initialOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

interface UseDropdownReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  referenceRef: RefObject<HTMLElement>;
  popperRef: RefObject<HTMLElement>;
}

export const useDropdown = ({ 
  initialOpen = false, 
  onToggle 
}: UseDropdownProps = {}): UseDropdownReturn => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const referenceRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLElement>(null);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const open = () => {
    if (!isOpen) {
      setIsOpen(true);
      onToggle?.(true);
    }
  };

  const close = () => {
    if (isOpen) {
      setIsOpen(false);
      onToggle?.(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        referenceRef.current &&
        popperRef.current &&
        !referenceRef.current.contains(event.target as Node) &&
        !popperRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    open,
    close,
    referenceRef,
    popperRef,
  };
};
