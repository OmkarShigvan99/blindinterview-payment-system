'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DesktopWindow } from '../DesktopSimulation';
import { Eye, EyeOff } from 'lucide-react';

export function ToggleVisibilityAnimation() {
    return (
        <>
            {/* BlindInterview Window with toggle visibility */}
            <motion.div
                className="absolute top-12 right-12 w-36 h-28"
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                    opacity: [1, 1, 0, 0, 1],
                    scale: [1, 1, 0.8, 0.8, 1],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.5, 0.75, 1],
                }}
            >
                <DesktopWindow
                    title="BlindInterview"
                    variant="blindinterview"
                    className="w-full h-full"
                />
            </motion.div>

            {/* Eye icon animation */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0, 0],
                    scale: [0, 1.2, 1.2, 0, 0],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    times: [0, 0.1, 0.4, 0.5, 1],
                }}
            >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/90 rounded-full">
                    <Eye className="w-6 h-6 text-white" />
                </div>
            </motion.div>

            {/* Alternate eye icon (closed) */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 0, 0, 1, 0],
                    scale: [0, 0, 0, 1.2, 0],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    times: [0, 0.5, 0.6, 0.9, 1],
                }}
            >
                <div className="flex items-center justify-center w-12 h-12 bg-slate-600/90 rounded-full">
                    <EyeOff className="w-6 h-6 text-white" />
                </div>
            </motion.div>

            {/* Ripple effect */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                    opacity: [0, 0.6, 0, 0, 0],
                    scale: [1, 3, 4, 1, 1],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                    times: [0, 0.3, 0.5, 0.7, 1],
                }}
            >
                <div className="w-12 h-12 border-2 border-primary/40 rounded-full" />
            </motion.div>

            {/* Visibility status indicators */}
            <motion.div
                className="absolute top-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: [0, 1, 1, 0, 0],
                    y: [-10, 0, 0, 10, -10],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    times: [0, 0.1, 0.4, 0.5, 1],
                }}
            >
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Visible
                </div>
            </motion.div>

            <motion.div
                className="absolute top-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: [0, 0, 0, 1, 0],
                    y: [-10, -10, -10, 0, 10],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    times: [0, 0.5, 0.6, 0.9, 1],
                }}
            >
                <div className="bg-slate-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Hidden
                </div>
            </motion.div>
        </>
    );
}
