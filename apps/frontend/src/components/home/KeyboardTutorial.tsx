'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Tag from '@/components/home/Tag';
import { KeyboardShortcutDemo } from '@/components/tutorial/KeyboardShortcutDemo';

const shortcuts = [
    {
        id: 'record-voice',
        shortcut: 'Ctrl + Space',
        label: 'Record Voice + Send to AI',
        description:
            'First press starts recording audio from the interviewer. Press again to stop recording and send the audio to AI for processing',
    },
    {
        id: 'move-app',
        shortcut: 'Ctrl + Arrow Keys',
        label: 'Move App Around',
        description: 'Reposition the BlindInterview window on your desktop',
    },
    {
        id: 'take-screenshot',
        shortcut: 'Ctrl + I',
        label: 'Take Screenshot',
        description:
            'Capture a screenshot of interview questions displayed on screen and send them to AI for instant answers',
    },
    {
        id: 'quit-app',
        shortcut: 'Alt + Q',
        label: 'Quit App',
        description: 'Close the BlindInterview application',
    },
    {
        id: 'toggle-visibility',
        shortcut: 'CapsLock',
        label: 'Toggle Visibility',
        description: 'Show or hide the BlindInterview window',
    },
];

export default function KeyboardTutorial() {
    return (
        <section className="py-8 px-4 sm:py-16 sm:px-8 md:py-24 md:px-18" id="Tutorial">
            <div className="container">
                <div className="flex justify-center mb-6">
                    <Tag>How to Use</Tag>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground text-center">
                    Master the <span className="text-primary">shortcuts</span>
                </h2>
                <p className="text-center text-xl text-muted-foreground mt-8 max-w-3xl mx-auto">
                    Learn the essential keyboard shortcuts to control BlindInterview like a pro.
                    Each shortcut is designed for efficiency and ease during your interview
                    preparation.
                </p>

                <div className="mt-16 space-y-12">
                    {shortcuts.map((shortcut, index) => (
                        <motion.div
                            key={shortcut.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                        >
                            {/* Left Column - Shortcut Info */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 px-4 py-2 bg-card border border-border rounded-lg font-mono text-sm">
                                            {shortcut.shortcut.split(' + ').map((key, keyIndex) => (
                                                <React.Fragment key={keyIndex}>
                                                    <kbd className="px-2 py-1 bg-muted border border-border/50 rounded text-xs font-semibold">
                                                        {key}
                                                    </kbd>
                                                    {keyIndex <
                                                        shortcut.shortcut.split(' + ').length -
                                                            1 && (
                                                        <span className="text-muted-foreground mx-1">
                                                            +
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-foreground">
                                        {shortcut.label}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {shortcut.description}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Animation */}
                            <div className="relative">
                                <KeyboardShortcutDemo shortcutId={shortcut.id} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
