/**
 * Reusable dropdown hook for consistent dropdown behavior
 */

import { useState, useEffect, useRef, RefObject } from 'react';
import { BaseHookReturn } from '../types/components';

interface UseDropdownProps {
  initialOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

interface UseDropdownState {
  isOpen: boolean;
  referenceRef: RefObject<HTMLElement>;
  popperRef: RefObject<HTMLElement>;
}

interface UseDropdownActions {
  toggle: () => void;
  open: () => void;
  close: () => void;
}

interface UseDropdownReturn extends BaseHookReturn<UseDropdownState, UseDropdownActions> {
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

  const state: UseDropdownState = {
    isOpen,
    referenceRef,
    popperRef
  };

  const actions: UseDropdownActions = {
    toggle,
    open,
    close
  };

  return {
    // Legacy flat structure for compatibility
    isOpen,
    toggle,
    open,
    close,
    referenceRef,
    popperRef,
    
    // New structured interface
    state,
    actions,
    status: { ready: true, loading: false, error: null }
  };
};
