'use client';

import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const buttonVariants = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                variant="secondary"
                className="rounded-full relative h-10 w-10 overflow-hidden p-0"
            >
                <AnimatePresence initial={false} mode="wait">
                    {theme === 'light' ? (
                        <motion.span
                            key="moon"
                            initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Moon className="h-5 w-5" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="sun"
                            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Sun className="h-5 w-5" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </motion.div>
    );
};
