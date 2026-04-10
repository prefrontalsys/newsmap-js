import { useCallback, useState } from 'react';

const STORAGE_KEY = 'newsmap-dismissed';

function loadDismissed() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveDismissed(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * Hook for managing dismissed articles via localStorage.
 * Stores { [normalizedTitle]: timestamp } so we can expire old entries.
 * @returns {{ dismissed: Set<string>, dismiss: (title: string) => void, clearDismissed: () => void }}
 */
export function useDismissedArticles() {
    const [dismissedMap, setDismissedMap] = useState(loadDismissed);

    const dismissed = new Set(Object.keys(dismissedMap));

    const dismiss = useCallback((title) => {
        const key = title.toLowerCase().trim();
        setDismissedMap(prev => {
            const next = { ...prev, [key]: Date.now() };
            saveDismissed(next);
            return next;
        });
    }, []);

    const clearDismissed = useCallback(() => {
        setDismissedMap({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { dismissed, dismiss, clearDismissed };
}
