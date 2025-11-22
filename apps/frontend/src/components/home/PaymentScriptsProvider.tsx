'use client';
import Script from 'next/script';

interface PaymentScriptsProviderProps {
    children: React.ReactNode;
}

export default function PaymentScriptsProvider({ children }: PaymentScriptsProviderProps) {
    return (
        <>
            {/* Cashfree SDK v3 */}
            <Script
                src="https://sdk.cashfree.com/js/v3/cashfree.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Cashfree SDK v3 loaded successfully');
                }}
                onError={() => {
                    console.error('Failed to load Cashfree SDK v3');
                }}
            />

            {/* Razorpay SDK */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Razorpay SDK loaded successfully');
                }}
                onError={() => {
                    console.error('Failed to load Razorpay SDK');
                }}
            />
            {children}
        </>
    );
}
