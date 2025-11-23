/**
 * Focus Trap Utility
 * Provides focus management for modal dialogs and other interactive overlays
 * to ensure keyboard navigation stays within the component.
 */

import React from 'react';

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | null;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  onDeactivate?: () => void;
}

export class FocusTrap {
  private container: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private options: FocusTrapOptions;
  private isActive = false;

  // Selectors for focusable elements
  private readonly FOCUSABLE_SELECTORS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(',');

  constructor(container: HTMLElement, options: FocusTrapOptions = {}) {
    this.container = container;
    this.options = {
      returnFocus: true,
      escapeDeactivates: true,
      ...options,
    };
  }

  /**
   * Get all focusable elements within the container
   */
  private getFocusableElements(): HTMLElement[] {
    const elements = Array.from(
      this.container.querySelectorAll<HTMLElement>(this.FOCUSABLE_SELECTORS)
    );

    // Filter out elements that are not visible or have negative tabindex
    return elements.filter((el) => {
      if (el.getAttribute('tabindex') === '-1') return false;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;

      return true;
    });
  }

  /**
   * Handle Tab key navigation within the trap
   */
  private handleTab = (event: KeyboardEvent): void => {
    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement;

    // Handle Shift+Tab (backwards)
    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    }
    // Handle Tab (forwards)
    else {
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  /**
   * Handle Escape key to deactivate trap
   */
  private handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.options.escapeDeactivates) {
      event.preventDefault();
      this.options.onDeactivate?.();
    }
  };

  /**
   * Handle all keyboard events
   */
  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      this.handleTab(event);
    } else if (event.key === 'Escape') {
      this.handleEscape(event);
    }
  };

  /**
   * Activate the focus trap
   */
  activate(): void {
    if (this.isActive) return;

    // Store the currently focused element
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Add event listeners
    document.addEventListener('keydown', this.handleKeydown, true);

    // Focus the initial element or the first focusable element
    const focusableElements = this.getFocusableElements();
    const elementToFocus = this.options.initialFocus || focusableElements[0];

    if (elementToFocus) {
      // Use a small delay to ensure the element is rendered and focusable
      setTimeout(() => {
        elementToFocus.focus();
      }, 10);
    }

    this.isActive = true;
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    if (!this.isActive) return;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown, true);

    // Return focus to the previously focused element
    if (this.options.returnFocus && this.previouslyFocused) {
      this.previouslyFocused.focus();
    }

    this.isActive = false;
  }

  /**
   * Update the container element
   */
  updateContainer(container: HTMLElement): void {
    this.container = container;
  }
}

/**
 * React Hook for using focus trap
 * Usage:
 *
 * const trapRef = useFocusTrap<HTMLDivElement>({
 *   isActive: isModalOpen,
 *   onDeactivate: () => setIsModalOpen(false)
 * });
 *
 * return <div ref={trapRef}>...</div>
 */
export function useFocusTrap<T extends HTMLElement>(
  options: FocusTrapOptions & { isActive: boolean }
): React.RefObject<T | null> {
  const containerRef = React.useRef<T | null>(null);
  const trapRef = React.useRef<FocusTrap | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Create focus trap instance
    if (!trapRef.current) {
      trapRef.current = new FocusTrap(containerRef.current, options);
    } else {
      trapRef.current.updateContainer(containerRef.current);
    }

    // Activate or deactivate based on isActive prop
    if (options.isActive) {
      trapRef.current.activate();
    } else {
      trapRef.current.deactivate();
    }

    // Cleanup on unmount
    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
    };
  }, [options.isActive]);

  return containerRef;
}

// For non-React usage
export default FocusTrap;
