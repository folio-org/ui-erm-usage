import { useEffect } from 'react';

export function useClickOutside(ref, overlayRef, handler, isOpen = true) {
  useEffect(() => {
    if (!isOpen) return () => {};

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && !overlayRef?.current?.contains(event.target)) {
        handler(event);
      }
    }

    // Add delay to avoid immediate trigger and closing when opening the element
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, overlayRef, isOpen]);
}
