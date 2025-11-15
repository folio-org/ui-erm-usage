import { useEffect } from 'react';

export function useClickOutside(ref, overlayRef, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && !overlayRef?.current?.contains(event.target)) {
        handler(event);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, overlayRef, handler]);
}
