/**
 * Mouse Event Handling Utilities
 * 
 * Utilities for handling mouse drag operations, particularly for panel resizing.
 * Provides common setup/teardown logic to avoid code duplication.
 */

export interface DragEventHandlers {
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: () => void;
}

/**
 * Sets up mouse drag event listeners and cursor styles
 */
export const startDragOperation = (handlers: DragEventHandlers): void => {
  document.addEventListener('mousemove', handlers.onMouseMove);
  document.addEventListener('mouseup', handlers.onMouseUp);
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';
};

/**
 * Cleans up mouse drag event listeners and resets cursor styles
 */
export const endDragOperation = (handlers: DragEventHandlers): void => {
  document.removeEventListener('mousemove', handlers.onMouseMove);
  document.removeEventListener('mouseup', handlers.onMouseUp);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

/**
 * Calculates new height for resize operations with min/max constraints
 */
export const calculateResizeHeight = (
  currentY: number,
  startY: number,
  startHeight: number,
  minHeight: number,
  maxHeight: number
): number => {
  const deltaY = currentY - startY;
  return Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
};
