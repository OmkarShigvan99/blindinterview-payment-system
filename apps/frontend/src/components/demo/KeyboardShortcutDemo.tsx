'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewSimulation from './InterviewSimulation';
import FeatureCard from './FeatureCard';

const KeyboardShortcutDemo = () => {
    const [activeDemo, setActiveDemo] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
    const [aiAssistantPosition, setAiAssistantPosition] = useState({ x: 50, y: 10 });
    const [screenshotTaken, setScreenshotTaken] = useState(false);

    const features = [
        {
            id: 'record',
            shortcut: 'Ctrl + W',
            icon: '🎙',
            title: 'Start/Stop Recording',
            description: 'Record the interviewer for AI assistance (simulated)',
            color: 'from-red-500 to-pink-500',
        },
        {
            id: 'screenshot',
            shortcut: 'Ctrl + I',
            icon: '📸',
            title: 'Capture Screenshot',
            description: 'Capture screenshots of coding questions for analysis',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: 'toggle',
            shortcut: 'Ctrl + T',
            icon: '🎛',
            title: 'Toggle AI Assistant',
            description: 'Show/hide AI Assistant overlay',
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 'move',
            shortcut: 'Ctrl + Arrow Keys',
            icon: '🎯',
            title: 'Move AI Assistant',
            description: 'Reposition AI Assistant around screen',
            color: 'from-purple-500 to-violet-500',
        },
        {
            id: 'exit',
            shortcut: 'Alt + Q',
            icon: '❌',
            title: 'Close Application',
            description: 'Properly close the application',
            color: 'from-orange-500 to-red-500',
        },
    ];

    // Keyboard event handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'w') {
                event.preventDefault();
                setActiveDemo('record');
                setIsRecording(!isRecording);
            } else if (event.ctrlKey && event.key === 'i') {
                event.preventDefault();
                setActiveDemo('screenshot');
                setScreenshotTaken(true);
                setTimeout(() => setScreenshotTaken(false), 2000);
            } else if (event.ctrlKey && event.key === 't') {
                event.preventDefault();
                setActiveDemo('toggle');
                setAiAssistantVisible(!aiAssistantVisible);
            } else if (event.ctrlKey && event.key.startsWith('Arrow')) {
                event.preventDefault();
                setActiveDemo('move');
                moveAiAssistant(event.key);
            } else if (event.altKey && event.key === 'q') {
                event.preventDefault();
                setActiveDemo('exit');
                simulateExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRecording, aiAssistantVisible]);

    const moveAiAssistant = (direction: string) => {
        setAiAssistantPosition((prev) => {
            switch (direction) {
                case 'ArrowUp':
                    return { ...prev, y: Math.max(0, prev.y - 10) };
                case 'ArrowDown':
                    return { ...prev, y: Math.min(80, prev.y + 10) };
                case 'ArrowLeft':
                    return { x: Math.max(0, prev.x - 10), y: prev.y };
                case 'ArrowRight':
                    return { x: Math.min(80, prev.x + 10), y: prev.y };
                default:
                    return prev;
            }
        });
    };

    const simulateExit = () => {
        // Simulate closing the application
        setTimeout(() => {
            setActiveDemo(null);
            setIsRecording(false);
            setAiAssistantVisible(false);
            setScreenshotTaken(false);
        }, 1000);
    };

    return (
        <div className="space-y-8">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                        isActive={activeDemo === feature.id}
                        onClick={() => setActiveDemo(feature.id)}
                    />
                ))}
            </div>

            {/* Interactive Demo Area */}
            <div className="relative">
                <InterviewSimulation
                    isRecording={isRecording}
                    screenshotTaken={screenshotTaken}
                    activeDemo={activeDemo}
                />

                {/* AI Assistant Overlay */}
                <AnimatePresence>
                    {aiAssistantVisible && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                position: 'absolute',
                                left: `${aiAssistantPosition.x}%`,
                                top: `${aiAssistantPosition.y}%`,
                                zIndex: 50,
                            }}
                            className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-green-500 shadow-2xl"
                        >
                            <div className="text-green-400 text-xs font-mono mb-2">
                                AI Assistant Active
                            </div>
                            <div className="text-sm space-y-1">
                                <div>🎯 AI Analysis: Ready</div>
                                <div>📊 Question Type: Array Manipulation</div>
                                <div>⚡ Confidence: 95%</div>
                                <div className="text-green-400">
                                    💡 Suggestion: Use two pointers approach
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Screenshot Flash Effect */}
                <AnimatePresence>
                    {screenshotTaken && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white pointer-events-none rounded-lg"
                        />
                    )}
                </AnimatePresence>

                {/* Exit Animation */}
                <AnimatePresence>
                    {activeDemo === 'exit' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-white text-center"
                            >
                                <div className="text-4xl mb-4">⚡</div>
                                <div className="text-xl font-semibold">Closing Application</div>
                                <div className="text-gray-300 mt-2">
                                    Thank you for using BlindInterview...
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10"
            >
                <h3 className="text-white text-lg font-semibold mb-4">
                    Try the Keyboard Shortcuts:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-3 text-gray-300">
                            <span className="text-lg">{feature.icon}</span>
                            <div>
                                <div className="font-mono text-blue-400">{feature.shortcut}</div>
                                <div>{feature.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default KeyboardShortcutDemo;
