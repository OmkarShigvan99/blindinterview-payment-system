'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewSimulationProps {
    isRecording: boolean;
    screenshotTaken: boolean;
    activeDemo: string | null;
}

const InterviewSimulation: React.FC<InterviewSimulationProps> = ({
    isRecording,
    screenshotTaken,
    activeDemo,
}) => {
    return (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800/50 px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-white text-sm font-medium">
                            Technical Interview - Interactive Demo
                        </span>
                    </div>

                    {/* Recording Indicator */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-2"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-3 h-3 bg-red-500 rounded-full"
                                />
                                <span className="text-red-400 text-sm font-medium">Recording</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative h-96 bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                {/* Split View - Interview Call & Code Editor */}
                <div className="flex h-full">
                    {/* Left Side - Video Call */}
                    <div className="w-1/2 relative border-r border-white/10">
                        {/* Video Call Interface */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl">👨‍💼</span>
                                </div>
                                <div className="text-lg font-medium">Interviewer</div>
                                <div className="text-sm text-white/70">
                                    Senior Software Engineer
                                </div>
                            </div>
                        </div>

                        {/* Your Video (small corner) */}
                        <div className="absolute bottom-4 right-4 w-24 h-18 bg-gray-700/80 rounded border border-white/20 flex items-center justify-center">
                            <span className="text-white text-xs">You</span>
                        </div>

                        {/* Recording Audio Waves */}
                        <AnimatePresence>
                            {isRecording && (
                                <div className="absolute bottom-4 left-4 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: [4, 16, 8, 20, 4],
                                                backgroundColor: [
                                                    '#ef4444',
                                                    '#f97316',
                                                    '#eab308',
                                                    '#22c55e',
                                                    '#3b82f6',
                                                ],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.8,
                                                delay: i * 0.1,
                                            }}
                                            className="w-1 bg-red-500 rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Interview Question Bubble */}
                        <div className="absolute top-4 left-4 right-4 bg-black/60 text-white p-3 rounded text-sm">
                            <div className="font-medium mb-1">Interviewer is asking:</div>
                            <div>
                                &quot;Can you implement a function to reverse a linked list in O(n)
                                time?&quot;
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Code Editor */}
                    <div className="w-1/2 relative">
                        <div className="absolute inset-0 bg-gray-900/80 text-green-400 font-mono text-sm p-4">
                            <div className="text-gray-500 mb-2"># LinkedList.py</div>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-blue-400">def</span>{' '}
                                    <span className="text-yellow-400">reverse_linked_list</span>
                                    (head):
                                </div>
                                <div className="ml-4">
                                    <span className="text-purple-400">prev</span> ={' '}
                                    <span className="text-orange-400">None</span>
                                </div>
                                <div className="ml-4">
                                    <span className="text-purple-400">current</span> = head
                                </div>
                                <div className="ml-4"></div>
                                <div className="ml-4">
                                    <span className="text-blue-400">while</span> current:
                                </div>
                                <div className="ml-8">
                                    <span className="text-purple-400">next_node</span> =
                                    current.next
                                </div>
                                <div className="ml-8">current.next = prev</div>
                                <div className="ml-8">prev = current</div>
                                <div className="ml-8">current = next_node</div>
                                <div className="ml-4"></div>
                                <div className="ml-4">
                                    <span className="text-blue-400">return</span> prev
                                </div>
                            </div>

                            {/* Cursor */}
                            <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="inline-block w-2 h-5 bg-green-400 ml-1"
                            />
                        </div>

                        {/* Screenshot Effect */}
                        <AnimatePresence>
                            {screenshotTaken && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.8, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-white pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        {/* Screenshot Notification */}
                        <AnimatePresence>
                            {screenshotTaken && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-xs"
                                >
                                    📸 Screenshot captured for analysis
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Demo Status Messages */}
                <AnimatePresence>
                    {activeDemo && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            {activeDemo === 'record' &&
                                (isRecording
                                    ? '🎙 Recording audio for AI analysis...'
                                    : '🎙 Recording stopped')}
                            {activeDemo === 'screenshot' &&
                                '📸 Question captured for AI processing'}
                            {activeDemo === 'toggle' && '🎛 AI Assistant overlay toggled'}
                            {activeDemo === 'move' && '🎯 AI Assistant position updated'}
                            {activeDemo === 'exit' && '❌ Closing application...'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InterviewSimulation;
