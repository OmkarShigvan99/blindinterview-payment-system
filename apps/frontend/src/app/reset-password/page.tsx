import { Suspense } from 'react';
import ResetPasswordForm from '@/forms/ResetPasswordForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function ResetPasswordContent() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/20">
            <div className="w-full max-w-lg rounded-2xl border bg-card shadow-lg p-8">
                <ResetPasswordForm />
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/20">
                    <div className="w-full max-w-lg rounded-2xl border bg-card shadow-lg p-8">
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner className="text-primary" />
                        </div>
                    </div>
                </main>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
