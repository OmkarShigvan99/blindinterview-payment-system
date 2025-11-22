import { AnimatePresence } from 'framer-motion';
import { ErrorAlert, SuccessAlert } from '@/components/ui/global';

interface ProfileAlertsProps {
    error: string | null;
    emailSent: { email: string; success: boolean };
}

export function ProfileAlerts({ error, emailSent }: ProfileAlertsProps) {
    return (
        <AnimatePresence>
            {error && <ErrorAlert message={error} title="Error" />}
            {emailSent.success && (
                <SuccessAlert
                    message={`A verification email has been sent to ${emailSent.email}`}
                    title="Email sent"
                />
            )}
        </AnimatePresence>
    );
}
