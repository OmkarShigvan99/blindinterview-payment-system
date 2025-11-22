'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2 } from 'lucide-react';

export function RecordVoiceAnimation() {
    return (
        <>
            {/* Sound wave animation near Interviewer window */}
            <motion.div
                className="absolute top-16 left-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-1">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                className="w-0.5 bg-blue-500 rounded-full"
                                animate={{
                                    height: [4, 12, 8, 16, 6],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Recording indicator on BlindInterview window */}
            <motion.div
                className="absolute top-8 right-8 w-3 h-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1,
                }}
            >
                <div className="w-full h-full bg-red-500 rounded-full animate-pulse" />
            </motion.div>

            {/* Audio transfer animation */}
            <motion.div
                className="absolute top-20 left-32"
                initial={{ opacity: 0, x: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 80, 80, 160],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: 'easeInOut',
                }}
            >
                <div className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-primary" />
                    <motion.div
                        className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-primary rounded-full"
                        animate={{
                            scaleX: [0, 1, 0],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 2,
                        }}
                    />
                </div>
            </motion.div>

            {/* Processing indicator in BlindInterview window */}
            <motion.div
                className="absolute top-16 right-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
            >
                <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </>
    );
}
