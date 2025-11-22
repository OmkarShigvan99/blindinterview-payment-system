'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DesktopWindow } from '../DesktopSimulation';
import { X } from 'lucide-react';

export function QuitAppAnimation() {
    return (
        <>
            {/* BlindInterview Window that will quit */}
            <motion.div
                className="absolute top-12 right-12 w-36 h-28"
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{
                    opacity: [1, 1, 0.7, 0],
                    scale: [1, 1, 0.9, 0.8],
                    y: [0, 0, 20, 40],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.7, 0.9, 1],
                }}
            >
                <DesktopWindow
                    title="BlindInterview"
                    variant="blindinterview"
                    className="w-full h-full"
                />
            </motion.div>

            {/* Close button highlight */}
            <motion.div
                className="absolute top-14 right-14 w-2 h-2 rounded-full bg-red-500"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [1, 1.5, 1.5, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 3,
                }}
            />

            {/* X close icon animation */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1.5, 2],
                    rotate: [0, 0, 180, 360],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    times: [0, 0.3, 0.7, 1],
                }}
            >
                <div className="flex items-center justify-center w-12 h-12 bg-red-500/90 rounded-full">
                    <X className="w-6 h-6 text-white" />
                </div>
            </motion.div>

            {/* Fade out effect */}
            <motion.div
                className="absolute inset-0 bg-black/20 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0, 0.3, 0.6],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.7, 0.9, 1],
                }}
            />

            {/* Sliding out effect */}
            <motion.div
                className="absolute top-12 w-36 h-28"
                initial={{ opacity: 0, x: 0 }}
                animate={{
                    opacity: [0, 0, 0.5, 0],
                    x: [0, 0, 100, 200],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.7, 0.95, 1],
                    ease: 'easeIn',
                }}
            >
                <div className="w-full h-full border-2 border-dashed border-red-400/50 rounded-lg" />
            </motion.div>

            {/* Quit confirmation */}
            <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    y: [10, 0, 0, -10],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                }}
            >
                <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium">
                    App closed
                </div>
            </motion.div>
        </>
    );
}
