import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan' | 'neutral';
export type RadiusPreset = 'sm' | 'md' | 'lg' | 'full';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
    readonly accent: AccentColor;
    readonly updateAccent: (accent: AccentColor) => void;
    readonly radius: RadiusPreset;
    readonly updateRadius: (radius: RadiusPreset) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'system';
let currentAccent: AccentColor = 'indigo';
let currentRadius: RadiusPreset = 'md';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    return (localStorage.getItem('appearance') as Appearance) || 'system';
};

const getStoredAccent = (): AccentColor => {
    if (typeof window === 'undefined') {
        return 'indigo';
    }

    return (localStorage.getItem('accent') as AccentColor) || 'indigo';
};

const getStoredRadius = (): RadiusPreset => {
    if (typeof window === 'undefined') {
        return 'md';
    }

    return (localStorage.getItem('radius') as RadiusPreset) || 'md';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: Appearance, accent?: AccentColor, radius?: RadiusPreset): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    const appliedAccent = accent ?? currentAccent;
    document.documentElement.setAttribute('data-accent', appliedAccent);

    const appliedRadius = radius ?? currentRadius;
    document.documentElement.setAttribute('data-radius', appliedRadius);
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => applyTheme(currentAppearance, currentAccent, currentRadius);

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('appearance')) {
        localStorage.setItem('appearance', 'system');
        setCookie('appearance', 'system');
    }

    currentAppearance = getStoredAppearance();
    currentAccent = getStoredAccent();
    currentRadius = getStoredRadius();
    applyTheme(currentAppearance, currentAccent, currentRadius);

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const accent: AccentColor = useSyncExternalStore(
        subscribe,
        () => currentAccent,
        () => 'indigo',
    );

    const radius: RadiusPreset = useSyncExternalStore(
        subscribe,
        () => currentRadius,
        () => 'md',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);

        applyTheme(mode, currentAccent, currentRadius);
        notify();
    };

    const updateAccent = (newAccent: AccentColor): void => {
        currentAccent = newAccent;

        localStorage.setItem('accent', newAccent);
        setCookie('accent', newAccent);

        applyTheme(currentAppearance, newAccent, currentRadius);
        notify();
    };

    const updateRadius = (newRadius: RadiusPreset): void => {
        currentRadius = newRadius;

        localStorage.setItem('radius', newRadius);
        setCookie('radius', newRadius);

        applyTheme(currentAppearance, currentAccent, newRadius);
        notify();
    };

    return {
        appearance,
        resolvedAppearance,
        updateAppearance,
        accent,
        updateAccent,
        radius,
        updateRadius,
    } as const;
}
