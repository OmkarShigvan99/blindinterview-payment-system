'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Brain } from 'lucide-react';

export function TakeScreenshotAnimation() {
    return (
        <>
            {/* Interview Question Display */}
            <motion.div
                className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-border max-w-72"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Coding Question:
                </div>
                <div className="text-sm text-foreground leading-relaxed">
                    &ldquo;Write a function to reverse a linked list. What&apos;s the time
                    complexity?&rdquo;
                </div>
            </motion.div>

            {/* Screenshot capture flash */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.8, 0],
                }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 3,
                }}
            />

            {/* Camera icon with screenshot action */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2.3,
                    times: [0, 0.2, 0.8, 1],
                }}
            >
                <div className="flex items-center justify-center w-12 h-12 bg-slate-800/90 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                </div>
            </motion.div>

            {/* Screenshot border flash */}
            <motion.div
                className="absolute inset-0 border-4 border-primary rounded-lg"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0.95, 1, 1.02],
                }}
                transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatDelay: 2.9,
                }}
            />

            {/* Data transfer animation to BlindInterview */}
            <motion.div
                className="absolute top-20 left-1/2"
                initial={{ opacity: 0, x: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 60, 120, 180],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1.8,
                    delay: 0.5,
                }}
            >
                <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <ArrowRight className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium">Sending to AI</span>
                </div>
            </motion.div>

            {/* AI Processing indicator in BlindInterview window */}
            <motion.div
                className="absolute top-14 right-14"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0, 0, 1.2, 1, 0],
                }}
                transition={{
                    duration: 3.3,
                    repeat: Infinity,
                    times: [0, 0.3, 0.5, 0.8, 1],
                }}
            >
                <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                    <Brain className="w-3 h-3 text-white" />
                </div>
            </motion.div>

            {/* Success notification */}
            <motion.div
                className="absolute bottom-4 right-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: [0, 0, 1, 1, 0],
                    y: [10, 10, 0, 0, -10],
                }}
                transition={{
                    duration: 3.3,
                    repeat: Infinity,
                    times: [0, 0.6, 0.7, 0.9, 1],
                }}
            >
                <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium">
                    Answer ready!
                </div>
            </motion.div>
        </>
    );
}
