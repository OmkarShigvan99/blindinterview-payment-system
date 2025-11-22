import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export type ErrorType = 'error' | 'warning' | 'success' | 'info';

interface ErrorMessageProps {
    /**
     * The error message to display
     */
    message: string;
    /**
     * Optional title for the error
     */
    title?: string;
    /**
     * Type of error - determines color and icon
     */
    type?: ErrorType;
    /**
     * Whether to show the error with animation
     */
    animate?: boolean;
    /**
     * Custom className for styling
     */
    className?: string;
    /**
     * Callback when error is dismissed (if dismissible)
     */
    onDismiss?: () => void;
    /**
     * Whether the error can be dismissed
     */
    dismissible?: boolean;
}

const errorConfig = {
    error: {
        variant: 'destructive' as const,
        icon: XCircle,
        defaultTitle: 'Error',
    },
    warning: {
        variant: 'default' as const,
        icon: AlertTriangle,
        defaultTitle: 'Warning',
    },
    success: {
        variant: 'default' as const,
        icon: CheckCircle,
        defaultTitle: 'Success',
    },
    info: {
        variant: 'default' as const,
        icon: Info,
        defaultTitle: 'Information',
    },
};

const typeStyles = {
    error: 'text-destructive [&>svg]:text-destructive',
    warning:
        'text-yellow-600 [&>svg]:text-yellow-600 dark:text-yellow-400 dark:[&>svg]:text-yellow-400',
    success:
        'text-green-600 [&>svg]:text-green-600 dark:text-green-400 dark:[&>svg]:text-green-400',
    info: 'text-blue-600 [&>svg]:text-blue-600 dark:text-blue-400 dark:[&>svg]:text-blue-400',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    title,
    type = 'error',
    animate = true,
    className,
    onDismiss,
    dismissible = false,
}) => {
    const config = errorConfig[type];
    const Icon = config.icon;
    const displayTitle = title || config.defaultTitle;

    const errorContent = (
        <Alert
            variant={config.variant}
            className={`relative ${typeStyles[type]} ${className || ''}`}
        >
            <Icon className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
                {displayTitle}
                {dismissible && onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
                        aria-label="Dismiss"
                    >
                        <XCircle className="h-3 w-3" />
                    </button>
                )}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );

    if (!animate) {
        return errorContent;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                key={message} // Re-animate on message change
            >
                {errorContent}
            </motion.div>
        </AnimatePresence>
    );
};

// Convenience components for specific error types
export const ErrorAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
    <ErrorMessage {...props} type="error" />
);

export const WarningAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
    <ErrorMessage {...props} type="warning" />
);

export const SuccessAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
    <ErrorMessage {...props} type="success" />
);

export const InfoAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
    <ErrorMessage {...props} type="info" />
);
