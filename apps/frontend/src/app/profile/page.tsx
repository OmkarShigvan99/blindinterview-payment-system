'use client';
import { useAuth } from '@/hooks/useAuth';
import { isAxiosError } from 'axios';
import { API_AUTH_ENDPOINTS, API_USER_ENDPOINTS } from '@/fetch/endpoints';
import { useEffect, useState } from 'react';
import { UserDTO } from '@shared/types/user';
import { withAuth } from '@/lib/withAuth';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAlerts } from '@/components/profile/ProfileAlerts';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileCreditsCard } from '@/components/profile/ProfileCreditsCard';
import { ProfileQuickActions } from '@/components/profile/ProfileQuickActions';

type UserProfileProps = object;

const UserProfile = withAuth(function ({}: UserProfileProps) {
    const { user, setLocalUser } = useAuth();
    const [error, setError] = useState<null | string>(null);
    const [emailSent, setEmailSent] = useState({ email: user.email, success: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user.id) return;

        const init = async () => {
            try {
                const response = await API_USER_ENDPOINTS.getUser({
                    id: user.id,
                });

                if (response.status === 200) {
                    const userData = response.data.data as UserDTO;
                    setLocalUser({
                        ...user,
                        ...userData,
                    });
                }
            } catch (err) {
                if (isAxiosError(err))
                    setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
                else setError('Something went wrong.');
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id]);

    const onSubmit = async () => {
        try {
            setError(null);
            setIsSubmitting(true);
            const response = await API_AUTH_ENDPOINTS.sendVerificationEmail({ email: user.email });
            if (response.status === 200) {
                setEmailSent({ email: user.email, success: true });
                setIsSubmitting(false);
            }
        } catch (err) {
            if (isAxiosError(err))
                setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
            else setError('Something went wrong.');
            setIsSubmitting(false);
            setEmailSent({ email: user.email, success: false });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user.id) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <ProfileHeader />
                <ProfileAlerts error={error} emailSent={emailSent} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ProfileCard user={user} isSubmitting={isSubmitting} onSubmit={onSubmit} />
                    </div>
                    <div className="space-y-6">
                        <ProfileCreditsCard credits={user.credits} />
                        <ProfileQuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default UserProfile;
