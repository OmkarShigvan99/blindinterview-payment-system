// src/mappers/user.mapper.ts

import type { IUserDocument } from '@src/model/user.model'; // or wherever IUser is defined
import type { UserDTO } from '@shared/types/user';
import { Types } from 'mongoose';

export function toUserDTO(
    user: IUserDocument | Types.ObjectId | string,
    skipSensitive = false,
): UserDTO | undefined {
    if (typeof user === 'string') {
        return undefined;
    }

    if (typeof user === 'object' && user instanceof Types.ObjectId) {
        return undefined;
    }

    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        credits: user.credits,
        accessToken: skipSensitive ? undefined : user.accessToken,
        refreshToken: skipSensitive ? undefined : user.refreshToken,
        planType: user.planType,
        planExpiry: user.planExpiry,
        role: user.role,
        acceptedTerms: user.acceptedTerms,
        acceptedTermsAt: user.acceptedTermsAt,
        acceptedPrivacyPolicy: user.acceptedPrivacyPolicy,
        acceptedPrivacyPolicyAt: user.acceptedPrivacyPolicyAt,
    };
}
