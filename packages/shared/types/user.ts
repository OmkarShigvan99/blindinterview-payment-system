import { Plans } from './pricingTier';

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isEmailVerified: boolean;
    credits: number | 'unlimited';
    accessToken?: string | null;
    refreshToken?: string | null;
    planType: Plans;
    planExpiry: Date | 'unlimited';
    role: 'user' | 'admin';
    isAuthenticated?: boolean;
    acceptedTerms: boolean;
    acceptedTermsAt?: Date;
    acceptedPrivacyPolicy: boolean;
    acceptedPrivacyPolicyAt?: Date;
}
