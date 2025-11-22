'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { DesktopSimulation } from './DesktopSimulation';
import { RecordVoiceAnimation } from './animations/RecordVoiceAnimation';
import { MoveAppAnimation } from './animations/MoveAppAnimation';
import { TakeScreenshotAnimation } from './animations/TakeScreenshotAnimation';
import { QuitAppAnimation } from './animations/QuitAppAnimation';
import { ToggleVisibilityAnimation } from './animations/ToggleVisibilityAnimation';

interface KeyboardShortcutDemoProps {
    shortcutId: string;
}

export function KeyboardShortcutDemo({ shortcutId }: KeyboardShortcutDemoProps) {
    const renderAnimation = () => {
        switch (shortcutId) {
            case 'record-voice':
                return <RecordVoiceAnimation />;
            case 'move-app':
                return <MoveAppAnimation />;
            case 'take-screenshot':
                return <TakeScreenshotAnimation />;
            case 'quit-app':
                return <QuitAppAnimation />;
            case 'toggle-visibility':
                return <ToggleVisibilityAnimation />;
            default:
                return null;
        }
    };

    // Determine if we should show the static BlindInterview window
    // For move-app, quit-app, and toggle-visibility, we don't want the static window
    // because the animation itself handles the BlindInterview window
    const showStaticBlindInterview = !['move-app', 'quit-app', 'toggle-visibility'].includes(
        shortcutId,
    );

    return (
        <div className="relative w-full h-80 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-border overflow-hidden">
            <DesktopSimulation showStaticBlindInterview={showStaticBlindInterview}>
                <AnimatePresence mode="wait">{renderAnimation()}</AnimatePresence>
            </DesktopSimulation>
        </div>
    );
}
