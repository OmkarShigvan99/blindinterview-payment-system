import './globals.css';
import type { Metadata } from 'next';
import ThemeProvider from '@/components/context/ThemeProvider';
import AuthProvider from '@/components/context/AuthProvider';
import PaymentScriptsProvider from '@/components/home/PaymentScriptsProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BRAND_INFO } from '@shared/constants/brand';

export const metadata: Metadata = {
    title: `${BRAND_INFO.DISPLAY_NAME} - ${BRAND_INFO.TAGLINE}`,
    description:
        'Prepare effectively for your interviews with AI assistance. Get instant feedback, smart insights, and proven strategies to succeed in any interview and land your dream job.',
    keywords:
        'interview preparation, AI interview tool, interview success, job interview help, interview coaching, interview questions, technical interviews',
    authors: [{ name: `${BRAND_INFO.DISPLAY_NAME} Team` }],
    creator: BRAND_INFO.DISPLAY_NAME,
    publisher: BRAND_INFO.DISPLAY_NAME,
    robots: 'index, follow',
    metadataBase: new URL('https://blindinterview.com'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Favicon */}
                <link rel="icon" type="image/svg+xml" href="/assets/ui-icons/logo-ico.svg" />
                <link rel="apple-touch-icon" href="/assets/ui-icons/logo-ico.svg" />

                {/* Essential Meta */}
                <meta name="theme-color" content="#aaff33" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://blindinterview.com" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://blindinterview.com" />
                <meta property="og:site_name" content={BRAND_INFO.DISPLAY_NAME} />
                <meta
                    property="og:title"
                    content={`${BRAND_INFO.DISPLAY_NAME} - ${BRAND_INFO.TAGLINE}`}
                />
                <meta
                    property="og:description"
                    content="Prepare effectively for your interviews with AI assistance. Get instant feedback, smart insights, and proven strategies to succeed in any interview and land your dream job."
                />
                <meta
                    property="og:image"
                    content="https://blindinterview.com/assets/ui-icons/logo-ico.svg"
                />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@blindinterview" />
                <meta
                    name="twitter:title"
                    content={`${BRAND_INFO.DISPLAY_NAME} - ${BRAND_INFO.TAGLINE}`}
                />
                <meta
                    name="twitter:description"
                    content="Prepare effectively for your interviews with AI assistance. Get instant feedback, smart insights, and proven strategies to succeed in any interview and land your dream job."
                />
                <meta
                    name="twitter:image"
                    content="https://blindinterview.com/assets/ui-icons/logo-ico.svg"
                />
            </head>
            <body className={` antialiased`} suppressHydrationWarning>
                <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                    <AuthProvider>
                        <PaymentScriptsProvider>
                            {children}
                            <Toaster />
                        </PaymentScriptsProvider>
                    </AuthProvider>
                    <div className="fixed bottom-4 right-4 z-50">
                        <ThemeToggle />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
