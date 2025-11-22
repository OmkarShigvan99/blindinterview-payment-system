import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'bounce';

interface LoadingSpinnerProps {
    /**
     * Size of the loading spinner
     */
    size?: LoadingSize;
    /**
     * Variant of the loading animation
     */
    variant?: LoadingVariant;
    /**
     * Loading text to display
     */
    text?: string;
    /**
     * Whether to center the spinner
     */
    centered?: boolean;
    /**
     * Custom className for styling (includes colors)
     */
    className?: string;
    /**
     * Whether to show as inline (no vertical spacing)
     */
    inline?: boolean;
}

const sizeConfig = {
    sm: {
        icon: 'h-4 w-4',
        text: 'text-sm',
        spacing: 'gap-2',
    },
    md: {
        icon: 'h-6 w-6',
        text: 'text-base',
        spacing: 'gap-3',
    },
    lg: {
        icon: 'h-8 w-8',
        text: 'text-lg',
        spacing: 'gap-4',
    },
    xl: {
        icon: 'h-12 w-12',
        text: 'text-xl',
        spacing: 'gap-4',
    },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'spinner',
    text,
    centered = false,
    className,
    inline = false,
}) => {
    const config = sizeConfig[size];

    const renderSpinner = () => {
        switch (variant) {
            case 'spinner':
                return <Loader2 className={cn(config.icon, 'animate-spin')} />;
            case 'dots':
                return (
                    <div className={cn('flex items-center gap-1')}>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={cn('w-2 h-2 rounded-full')}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                );
            case 'pulse':
                return (
                    <motion.div
                        className={cn(config.icon, 'rounded-full')}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                        }}
                    />
                );
            case 'bounce':
                return (
                    <div className={cn('flex items-center gap-1')}>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={cn('w-2 h-2 rounded-full')}
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                );
            default:
                return <LoaderCircle className={cn(config.icon, 'animate-spin')} />;
        }
    };

    const content = (
        <div
            className={cn(
                'flex items-center',
                config.spacing,
                centered && 'justify-center',
                !inline && 'py-4',
                className,
            )}
        >
            {renderSpinner()}
            {text && <span className={cn(config.text)}>{text}</span>}
        </div>
    );

    if (centered && !inline) {
        return <div className="flex items-center justify-center min-h-[200px]">{content}</div>;
    }

    return content;
};

// Convenience components for common loading states
export const PageLoading: React.FC<{
    text?: string;
    className?: string;
}> = ({ text = 'Loading...', className }) => (
    <LoadingSpinner size="lg" text={text} centered className={className} />
);

export const ButtonLoading: React.FC<{
    text?: string;
    className?: string;
}> = ({ text, className }) => <LoadingSpinner size="sm" text={text} inline className={className} />;

export const CardLoading: React.FC<{
    text?: string;
    className?: string;
}> = ({ text = 'Loading...', className }) => (
    <div className="p-6 text-center">
        <LoadingSpinner size="md" text={text} centered className={className} />
    </div>
);

export const InlineLoading: React.FC<{
    text?: string;
    size?: LoadingSize;
    className?: string;
}> = ({ text, size = 'sm', className }) => (
    <LoadingSpinner size={size} text={text} inline className={className} />
);
