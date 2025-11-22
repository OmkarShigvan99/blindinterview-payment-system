import ForgotPasswordForm from '@/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/20">
            <div className="w-full max-w-lg rounded-2xl border bg-card shadow-lg p-8">
                <ForgotPasswordForm />
            </div>
        </main>
    );
}
