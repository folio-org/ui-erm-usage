import {
  useEffect,
  useRef,
} from 'react';

export function useFocusManagement(dialogRef, isOpen) {
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // save current focused element
      previousFocusRef.current = document.activeElement;

      // focus Monthpicker dialog (after delay to ensure the element is rendered)
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 100);
    } else if (previousFocusRef.current) {
      // focus previous saved element
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [dialogRef, isOpen]);
}
