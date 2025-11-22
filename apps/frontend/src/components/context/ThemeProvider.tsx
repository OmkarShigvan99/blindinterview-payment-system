'use client';
import { createContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type Props = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type state = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: state = {
    theme: 'system',
    setTheme: () => null,
};

export const ThemeProviderContext = createContext<state>(initialState);

export default function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'ui-theme',
    ...props
}: Props) {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('ui-theme') as 'light' | 'dark' | 'system') ?? 'system';
        }
        return defaultTheme; // default fallback on server
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
