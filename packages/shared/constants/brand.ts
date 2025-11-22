/**
 * Brand constants for consistent styling across the application
 */

export const BRAND_COLORS = {
    // Primary brand color in various formats
    PRIMARY_HEX: '#76be00',
    PRIMARY_RGB: 'rgb(118, 190, 0)',

    // OKLCH format for CSS custom properties (more perceptually uniform)
    PRIMARY_LIGHT: '#76be00', // Light mode primary - darker green for better contrast
    PRIMARY_DARK: 'oklch(85% 0.25 130)', // Dark mode primary - brighter for visibility

    // Additional brand colors
    ACCENT_HEX: '#5a9000',

    // Payment gateway theme colors
    RAZORPAY_THEME: '#76be00',

    // Email template colors
    EMAIL_BUTTON: '#76be00',
    EMAIL_DANGER: '#dc2626',
    EMAIL_INFO: '#2563eb',
} as const;

export const BRAND_INFO = {
    NAME: 'Blind Interview',
    DISPLAY_NAME: 'Blind Interview',
    TAGLINE: 'AI-Powered Interview Cracking Tool',

    // Email configuration
    EMAIL_MAILER: 'Blind Interview Platform',
} as const;

export const BRAND_URLS = {
    LOGO_SVG: '/assets/ui-icons/logo.svg',
    LOGO_ICO: '/assets/ui-icons/logo-ico.svg',
    LOGO_PNG: '/assets/ui-icons/logo.png',
} as const;

// Type exports for TypeScript
export type BrandColor = keyof typeof BRAND_COLORS;
export type BrandInfo = keyof typeof BRAND_INFO;
