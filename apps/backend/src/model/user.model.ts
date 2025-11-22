import { type Model, Schema, model, type Document, type ClientSession } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateSoftColor, initials } from '@src/utils/avatar-generator';
import {
    generateAccessToken,
    generateForgotPasswordToken,
    generateEmailVerificationToken,
    generateRefreshToken,
} from '@src/utils/token';
import jwt from 'jsonwebtoken';
import { Plans } from '@shared/types/pricingTier';
import { enumToValues } from '@shared/utils/enum-values';
import { addDays } from 'date-fns';
import { PricingTierModel } from './pricing-tier.model';

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    isEmailVerified: boolean;
    credits: number | 'unlimited';
    accessToken: string | null;
    refreshToken: string | null;
    emailVerificationToken?: string;
    forgotPasswordToken?: string;
    planType: Plans;
    planExpiry: Date | 'unlimited';
    role: 'user' | 'admin';
    acceptedTerms: boolean;
    acceptedTermsAt?: Date;
    acceptedPrivacyPolicy: boolean;
    acceptedPrivacyPolicyAt?: Date;
}

export interface IUserMethods {
    comparePassword: (password: string) => Promise<boolean>;
    generateTokens: () => {
        accessToken: string;
        refreshToken: string;
    };
    generateForgotPasswordToken: () => string;
    generateEmailVerificationToken: () => string;
    renewPlan: (
        planType: Plans,
        session?: ClientSession,
        callback?: (user: IUserDocument) => void,
    ) => Promise<void>;
    decrementCredits: (amount: number) => Promise<void>;
}

export interface IUserStaticMethods {
    verifyToken: (token: string, secret: string) => unknown;
}

export interface IUserDocument extends IUser, Document, IUserMethods {}

const UserSchema = new Schema<
    IUserDocument,
    Model<IUserDocument> & IUserStaticMethods,
    IUserMethods
>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: null },
        isEmailVerified: { type: Boolean, default: false },
        credits: { type: Schema.Types.Mixed, default: 5, min: 0, required: true },
        accessToken: { type: String, default: null },
        refreshToken: { type: String, default: null },
        emailVerificationToken: { type: String, default: undefined },
        forgotPasswordToken: { type: String, default: undefined },
        planType: {
            type: String,
            enum: enumToValues(Plans),
            default: Plans.FREE,
        },
        planExpiry: { type: Schema.Types.Mixed, required: true, default: 'unlimited' },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        acceptedTerms: { type: Boolean, required: true, default: false },
        acceptedTermsAt: { type: Date, default: undefined },
        acceptedPrivacyPolicy: { type: Boolean, required: true, default: false },
        acceptedPrivacyPolicyAt: { type: Date, default: undefined },
    },
    {
        timestamps: true,
    },
);

UserSchema.pre<IUserDocument>('save', async function (next) {
    if (this.isModified('password')) {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Default salt is 10
        this.password = await bcrypt.hash(this.password, 10);
    }

    this.avatar ??= `https://placehold.co/400x400/${generateSoftColor()}/FFFFFF/?text=${initials(this.name)}`;

    next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateTokens = function (): { accessToken: string; refreshToken: string } {
    const accessToken = generateAccessToken({ id: String(this._id), email: this.email });
    const refreshToken = generateRefreshToken({ id: String(this._id), email: this.email });
    return { accessToken, refreshToken };
};

UserSchema.methods.generateForgotPasswordToken = function (): string {
    return generateForgotPasswordToken({ id: String(this._id), email: this.email });
};

UserSchema.methods.generateEmailVerificationToken = function (): string {
    return generateEmailVerificationToken({ id: String(this._id), email: this.email });
};

UserSchema.methods.renewPlan = async function (
    planType: Plans,
    session?: ClientSession,
    callback?: (user: IUserDocument) => void,
): Promise<void> {
    const planInfo = await PricingTierModel.findOne({ name: planType });

    if (planInfo == null) {
        throw new Error('Plan not found');
    }

    const now = new Date();
    if (planInfo.expiryInDays === 'unlimited') {
        this.planExpiry = 'unlimited';
    } else {
        this.planExpiry = addDays(now, planInfo.expiryInDays);
    }

    // Update credits
    if (planInfo.creditsIncluded !== 'unlimited') {
        const currentCredits =
            typeof this.credits === 'number' && !isNaN(this.credits) ? this.credits : 0;
        this.credits = currentCredits + planInfo.creditsIncluded;
    } else {
        this.credits = 'unlimited';
    }

    // Update plan type
    this.planType = planType;

    // callback
    if (callback) {
        callback(this);
    }

    await this.save({ session });
};

UserSchema.methods.decrementCredits = async function (amount: number): Promise<void> {
    if (typeof this.credits === 'number' && !isNaN(this.credits) && this.credits >= 0) {
        this.credits -= amount;
    }
    await this.save();
};

UserSchema.statics.verifyToken = (token: string, secret: string): unknown =>
    jwt.verify(token, secret);

export const UserModel = model<IUserDocument, Model<IUserDocument> & IUserStaticMethods>(
    'User',
    UserSchema,
);
