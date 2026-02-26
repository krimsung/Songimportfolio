import { useCallback } from 'react';

/**
 * Custom hook for handling navigation with modifier key support
 * Allows Ctrl/Cmd+Click to open in new tab while preventing default for regular clicks
 */
export function useNavigation() {
  const handleNavigationClick = useCallback(
    (event: React.MouseEvent, callback: () => void) => {
      // Allow browser default behavior for modifier keys or middle mouse button
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button === 1
      ) {
        return;
      }

      // Prevent default and execute callback for regular clicks
      event.preventDefault();
      callback();
    },
    []
  );

  return { handleNavigationClick };
}
