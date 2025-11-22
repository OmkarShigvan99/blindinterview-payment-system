import { ENV } from '@src/config/env';
import { logger } from '@src/utils/logger';
import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { format } from 'date-fns';
import { BRAND_COLORS, BRAND_INFO, BRAND_URLS } from '@shared/constants/brand';

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: BRAND_INFO.DISPLAY_NAME,
        link: ENV.FRONTEND_URL,
        logo: `${ENV.FRONTEND_URL}${BRAND_URLS.LOGO_PNG}`,
        logoHeight: '32px',
        copyright: `Copyright © ${new Date().getFullYear()} ${BRAND_INFO.DISPLAY_NAME}. All rights reserved.`,
    },
});

// function create email verification template
export const createEmailVerificationTemplate = (name: string, token: string): string => {
    const emailBody = mailGenerator.generate({
        body: {
            name,
            intro: [
                `Welcome to ${BRAND_INFO.DISPLAY_NAME}!`,
                'Thank you for creating your account. Get ready to crack any technical interview with AI-powered assistance.',
            ],
            action: {
                instructions:
                    'To complete your registration and start using our AI assistant that helps you answer interview questions in real-time, please verify your email address by clicking the button below:',
                button: {
                    color: BRAND_COLORS.EMAIL_BUTTON,
                    text: 'Verify Email Address',
                    link: `${ENV.FRONTEND_URL}/verify-email?token=${token}`,
                },
            },
            outro: [
                'This verification link will expire in 24 hours for security purposes.',
                `If you didn't create an account with ${BRAND_INFO.DISPLAY_NAME}, please ignore this email or contact our support team.`,
                'Need help? Reply to this email or visit our help center.',
            ],
        },
    });

    return emailBody;
};

// function create reset password template
export const createResetPasswordTemplate = (name: string, token: string): string => {
    const emailBody = mailGenerator.generate({
        body: {
            name,
            intro: [
                `We received a request to reset your ${BRAND_INFO.DISPLAY_NAME} account password.`,
                "Don't worry - this happens to the best of us!",
            ],
            action: {
                instructions:
                    'To create a new password, click the secure link below. This link will expire in 1 hour for your account security.',
                button: {
                    color: BRAND_COLORS.EMAIL_DANGER,
                    text: 'Reset Password Securely',
                    link: `${ENV.FRONTEND_URL}/reset-password?token=${token}`,
                },
            },
            outro: [
                "If you didn't request a password reset, you can safely ignore this email. Your account remains secure.",
                'For security reasons, this link will expire in 1 hour.',
                `If the button doesn't work, copy and paste this link into your browser: ${ENV.FRONTEND_URL}/reset-password?token=${token}`,
                'Having trouble? Contact our support team for immediate assistance.',
            ],
        },
    });

    return emailBody;
};

export const createLowCreditsTemplate = (name: string, credits: number): string => {
    const emailBody = mailGenerator.generate({
        body: {
            name,
            intro: [
                `You're running low on credits in your ${BRAND_INFO.DISPLAY_NAME} account.`,
                `You currently have ${credits} credit${credits === 1 ? '' : 's'} remaining.`,
            ],
            action: {
                instructions:
                    'To continue using our AI assistant that provides real-time answers during your technical interviews, we recommend upgrading your plan or purchasing additional credits.',
                button: {
                    color: BRAND_COLORS.EMAIL_INFO,
                    text: 'Upgrade Your Plan',
                    link: `${ENV.FRONTEND_URL}/buy`,
                },
            },
            outro: [
                'Low credits may limit your access to AI-powered real-time interview assistance.',
                'Our team is here to help you choose the best plan for cracking your upcoming interviews.',
                'Questions about plans or billing? Reply to this email for personalized assistance.',
            ],
        },
    });

    return emailBody;
};

export const createPlanUpgradeTemplate = (
    name: string,
    fromPlan: string,
    toPlan: string,
    expiryDate: Date | string,
): string => {
    // Format the expiry date to a human-readable format
    const formattedExpiryDate =
        expiryDate instanceof Date
            ? format(expiryDate, 'EEEE, MMMM do, yyyy')
            : format(new Date(expiryDate), 'EEEE, MMMM do, yyyy');

    const emailBody = mailGenerator.generate({
        body: {
            name,
            intro: [
                `Congratulations! Your ${BRAND_INFO.DISPLAY_NAME} plan has been successfully upgraded.`,
                'You now have enhanced AI capabilities to crack even the toughest technical interviews.',
            ],
            table: {
                data: [
                    {
                        item: 'Previous Plan',
                        description: fromPlan,
                    },
                    {
                        item: 'New Plan',
                        description: toPlan,
                    },
                    {
                        item: 'Plan Expires',
                        description: formattedExpiryDate,
                    },
                ],
                columns: {
                    customWidth: {
                        item: '30%',
                        description: '70%',
                    },
                },
            },
            action: {
                instructions:
                    'Your enhanced AI assistant is now active and ready to help you crush your next interview. Access your account dashboard to explore your new capabilities:',
                button: {
                    color: BRAND_COLORS.EMAIL_BUTTON,
                    text: 'Access Dashboard',
                    link: `${ENV.FRONTEND_URL}/profile`,
                },
            },
            outro: [
                `Thank you for choosing ${BRAND_INFO.DISPLAY_NAME} to advance your career.`,
                'Our enhanced AI will provide even smarter real-time answers during your technical interviews.',
                'Need assistance with your new features? Our support team is ready to help.',
            ],
        },
    });

    return emailBody;
};

// function to create transporter
export const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    auth: {
        user: ENV.SMTP_USERNAME,
        pass: ENV.SMTP_PASSWORD,
    },
});

export const sendMail = async (
    email: string,
    subject: string,
    emailBody: string,
): Promise<void> => {
    const mailOptions: Mail.Options = {
        from: `${BRAND_INFO.DISPLAY_NAME} <${ENV.SMTP_EMAIL}>`, // Clean brand format
        to: email,
        subject: `${subject}`, // Add brand prefix
        html: emailBody,
        text: emailBody as string,
        // Additional headers to reduce spam likelihood
        headers: {
            'X-Mailer': BRAND_INFO.EMAIL_MAILER,
            'X-Priority': '3',
        },
    };
    await transporter.sendMail(mailOptions);
};

if (ENV.NODE_ENV === 'development') {
    transporter.verify((error: any) => {
        if (error !== null) {
            logger.error('SMTP connection failed:', error);
        } else {
            logger.info('✅ SMTP server is ready to take messages');
        }
    });
}
