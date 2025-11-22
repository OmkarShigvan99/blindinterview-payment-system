'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DesktopWindow } from '../DesktopSimulation';

export function MoveAppAnimation() {
    return (
        <>
            {/* Animated BlindInterview Window */}
            <motion.div
                className="absolute w-36 h-28"
                animate={{
                    x: [120, 160, 160, 120, 80, 80, 120],
                    y: [48, 48, 80, 80, 80, 48, 48],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <DesktopWindow
                    title="BlindInterview"
                    variant="blindinterview"
                    className="w-full h-full"
                />
            </motion.div>

            {/* Direction indicators */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: 0.5,
                }}
            >
                <div className="relative w-16 h-16">
                    {/* Arrow indicators */}
                    <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2"
                        animate={{ y: [-2, -6, -2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-primary/60" />
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-180"
                        animate={{ y: [2, 6, 2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    >
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-primary/60" />
                    </motion.div>

                    <motion.div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90"
                        animate={{ x: [-2, -6, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                    >
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-primary/60" />
                    </motion.div>

                    <motion.div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90"
                        animate={{ x: [2, 6, 2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1.5 }}
                    >
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-primary/60" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Trail effect */}
            <motion.div
                className="absolute w-36 h-28"
                animate={{
                    x: [120, 160, 160, 120, 80, 80, 120],
                    y: [48, 48, 80, 80, 80, 48, 48],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.1,
                }}
            >
                <motion.div
                    className="w-full h-full border-2 border-dashed border-primary/30 rounded-lg"
                    animate={{
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </>
    );
}
