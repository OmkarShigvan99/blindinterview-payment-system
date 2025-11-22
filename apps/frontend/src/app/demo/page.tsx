'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BlindInterviewWorkflowDemo from '../../components/demo/BlindInterviewWorkflowDemo';

const DemoPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
            {/* Neon lime glow effects matching the main theme */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(180,255,100,0.08),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(150,255,120,0.06),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,80,0.03),transparent_80%)] pointer-events-none" />

            {/* Subtle animated glow */}
            <div className="fixed inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(180,255,100,0.02)_60deg,transparent_120deg)] animate-pulse pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        BlindInterview Interactive Demo
                    </h1>
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-4xl mx-auto mb-6">
                        <p className="text-amber-800 dark:text-amber-200 font-medium">
                            ⚠️ Interactive Simulation - This is a demonstration showing how
                            BlindInterview works during interviews. Not a live application.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-4xl mx-auto mb-6">
                        <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-3">
                            📋 Actual Application Key Configurations:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <div>
                                🎧{' '}
                                <kbd className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                    Ctrl+Space
                                </kbd>{' '}
                                Start/Stop Recording
                            </div>
                            <div>
                                🔝{' '}
                                <kbd className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                    CapsLock
                                </kbd>{' '}
                                Toggle Position
                            </div>
                            <div>
                                📸{' '}
                                <kbd className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                    Ctrl+I
                                </kbd>{' '}
                                Screenshot
                            </div>
                            <div>
                                ⬅{' '}
                                <kbd className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                    Ctrl+Arrows
                                </kbd>{' '}
                                Move
                            </div>
                            <div>
                                ❌{' '}
                                <kbd className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                    Alt+Q
                                </kbd>{' '}
                                Quit
                            </div>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm mt-3 italic">
                            Note: For this browser simulation, Ctrl keys are modified to prevent
                            conflicts with browser shortcuts.
                        </p>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Experience the user interface and workflow of BlindInterview through this
                        interactive simulation. Learn how keyboard shortcuts enable efficient AI
                        assistance for your interview preparation.
                    </p>
                </motion.div>

                <BlindInterviewWorkflowDemo />
            </div>
        </div>
    );
};

export default DemoPage;
