'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DesktopSimulationProps {
    children: React.ReactNode;
    showStaticBlindInterview?: boolean;
}

interface WindowProps {
    title: string;
    className?: string;
    children?: React.ReactNode;
    variant?: 'interviewer' | 'blindinterview';
}

export function DesktopSimulation({
    children,
    showStaticBlindInterview = true,
}: DesktopSimulationProps) {
    return (
        <div className="relative w-full h-full">
            {/* Aspect Ratio Container - Responsive sizing for better mobile usage */}
            <div className="relative w-full h-full sm:aspect-video sm:max-h-full mx-auto">
                {/* Desktop Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-lg" />

                {/* Taskbar */}
                <div className="absolute bottom-0 left-0 right-0 h-[8%] min-h-[40px] sm:h-[6%] sm:min-h-[32px] bg-slate-300 dark:bg-slate-600 border-t border-slate-400 dark:border-slate-500 flex items-center px-[2%] sm:px-[1%] gap-[2%] sm:gap-[1%] rounded-b-lg">
                    {/* Start Button */}
                    <div className="h-[70%] aspect-[3/2] bg-slate-400 dark:bg-slate-700 rounded border border-slate-500 dark:border-slate-600 flex items-center justify-center">
                        <div className="w-[60%] aspect-square bg-primary rounded-sm flex items-center justify-center">
                            <div className="w-[50%] aspect-square bg-white rounded-xs"></div>
                        </div>
                    </div>

                    {/* System Tray Area */}
                    <div className="ml-auto flex items-center gap-[1%] sm:gap-[0.5%]">
                        <div className="text-xs sm:text-[0.6rem] md:text-xs text-slate-600 dark:text-slate-300 font-mono">
                            12:34
                        </div>
                    </div>
                </div>

                {/* Windows Container */}
                <div className="absolute inset-0 pb-[8%] sm:pb-[6%]">
                    {/* Interviewer Window */}
                    <DesktopWindow
                        title="Interviewer"
                        variant="interviewer"
                        className="absolute top-[6%] sm:top-[8%] left-[4%] sm:left-[6%] w-[42%] sm:w-[25%] h-[45%] sm:h-[35%]"
                    />

                    {/* BlindInterview Window - only show if enabled */}
                    {showStaticBlindInterview && (
                        <DesktopWindow
                            title="BlindInterview"
                            variant="blindinterview"
                            className="absolute top-[10%] sm:top-[12%] right-[4%] sm:right-[8%] w-[42%] sm:w-[25%] h-[45%] sm:h-[35%]"
                        />
                    )}

                    {/* Animation Layer */}
                    <div className="absolute inset-0">{children}</div>
                </div>
            </div>
        </div>
    );
}

export function DesktopWindow({
    title,
    className,
    children,
    variant = 'interviewer',
}: WindowProps) {
    const isBlindInterview = variant === 'blindinterview';

    return (
        <motion.div
            className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg border ${
                isBlindInterview
                    ? 'border-primary/30 shadow-primary/20'
                    : 'border-slate-300 dark:border-slate-600'
            } ${className}`}
            initial={{ opacity: 1 }}
        >
            {/* Title Bar */}
            <div
                className={`h-[18%] min-h-[24px] sm:h-[20%] sm:min-h-[20px] rounded-t-lg px-[6%] sm:px-[4%] flex items-center justify-between ${
                    isBlindInterview
                        ? 'bg-primary/20 border-b border-primary/30'
                        : 'bg-slate-200 dark:bg-slate-700 border-b border-slate-300 dark:border-slate-600'
                }`}
            >
                <div className="flex items-center gap-[0.4rem] sm:gap-[0.3rem]">
                    <div className="w-[0.6rem] h-[0.6rem] sm:w-[0.5rem] sm:h-[0.5rem] rounded-full bg-red-400" />
                    <div className="w-[0.6rem] h-[0.6rem] sm:w-[0.5rem] sm:h-[0.5rem] rounded-full bg-yellow-400" />
                    <div className="w-[0.6rem] h-[0.6rem] sm:w-[0.5rem] sm:h-[0.5rem] rounded-full bg-green-400" />
                </div>
                <span
                    className={`text-xs sm:text-[0.6rem] md:text-xs font-medium truncate max-w-[60%] ${
                        isBlindInterview ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                    }`}
                >
                    {title}
                </span>
                <div className="w-[2rem]" />
            </div>

            {/* Window Content */}
            <div className="h-[82%] sm:h-[80%] p-[6%] sm:p-[4%] flex items-center justify-center">
                {children || (
                    <div
                        className={`text-xs sm:text-[0.6rem] md:text-xs text-center ${
                            isBlindInterview
                                ? 'text-primary/60'
                                : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                        {title}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
