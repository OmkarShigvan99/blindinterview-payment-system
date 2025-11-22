import { useState } from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentProvider } from '@shared/types/order';
import Link from 'next/link';

interface PaymentSelectionProps {
    onPaymentSelect: (
        provider: PaymentProvider,
        acceptedTerms: boolean,
        acceptedRefundPolicy: boolean,
        acceptedPrivacyPolicy: boolean,
    ) => void;
    isProcessing: boolean;
    isRedirecting: boolean;
}

export function PaymentSelection({
    onPaymentSelect,
    isProcessing,
    isRedirecting,
}: PaymentSelectionProps) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false);
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
    const [acceptedAll, setAcceptedAll] = useState(false);

    const canProceed =
        acceptedTerms &&
        acceptedRefundPolicy &&
        acceptedPrivacyPolicy &&
        !isProcessing &&
        !isRedirecting;

    // Handle global checkbox that controls all individual checkboxes
    const handleAcceptAll = (checked: boolean) => {
        setAcceptedAll(checked);
        setAcceptedTerms(checked);
        setAcceptedRefundPolicy(checked);
        setAcceptedPrivacyPolicy(checked);
    };

    // Update global checkbox state when individual checkboxes change
    const handleIndividualChange = (setter: (value: boolean) => void, value: boolean) => {
        setter(value);

        // Update the "accept all" state based on individual checkbox states
        const newTerms = setter === setAcceptedTerms ? value : acceptedTerms;
        const newRefund = setter === setAcceptedRefundPolicy ? value : acceptedRefundPolicy;
        const newPrivacy = setter === setAcceptedPrivacyPolicy ? value : acceptedPrivacyPolicy;

        setAcceptedAll(newTerms && newRefund && newPrivacy);
    };

    const handlePaymentSelect = (provider: PaymentProvider) => {
        if (canProceed) {
            onPaymentSelect(provider, acceptedTerms, acceptedRefundPolicy, acceptedPrivacyPolicy);
        }
    };

    return (
        <div className="space-y-6">
            {/* Terms and Conditions Acceptance */}
            <Card>
                <CardHeader>
                    <CardTitle>Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Global Accept All Checkbox */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="accept-all"
                                checked={acceptedAll}
                                onChange={(e) => handleAcceptAll(e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="space-y-1">
                                <label
                                    htmlFor="accept-all"
                                    className="text-base font-semibold leading-none cursor-pointer text-primary"
                                >
                                    I accept all terms and policies
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    This will accept Terms & Conditions, No Refund Policy, and
                                    Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Individual Checkboxes - Collapsible Details */}
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                            View individual terms and policies
                        </summary>
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-border">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) =>
                                        handleIndividualChange(setAcceptedTerms, e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        I accept the Terms and Conditions
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Please read and accept our{' '}
                                        <Link
                                            href="/terms"
                                            target="_blank"
                                            className="text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            Terms and Conditions
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>{' '}
                                        before proceeding with the payment.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="refund-policy"
                                    checked={acceptedRefundPolicy}
                                    onChange={(e) =>
                                        handleIndividualChange(
                                            setAcceptedRefundPolicy,
                                            e.target.checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="refund-policy"
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        I understand the No Refund Policy
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        I acknowledge that all sales are final. Please review our{' '}
                                        <Link
                                            href="/refund-policy"
                                            target="_blank"
                                            className="text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            No Refund Policy
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>{' '}
                                        for more details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="privacy-policy"
                                    checked={acceptedPrivacyPolicy}
                                    onChange={(e) =>
                                        handleIndividualChange(
                                            setAcceptedPrivacyPolicy,
                                            e.target.checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="privacy-policy"
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        I accept the Privacy Policy
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Please read and accept our{' '}
                                        <Link
                                            href="/privacy"
                                            target="_blank"
                                            className="text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            Privacy Policy
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>{' '}
                                        for more details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </details>

                    {!canProceed && !isProcessing && !isRedirecting && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                Please accept the Terms and Conditions, No Refund Policy, and
                                Privacy Policy to proceed with payment.
                            </p>
                        </div>
                    )}

                    {/* Processing Payment Message */}
                    {(isProcessing || isRedirecting) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                <div className="space-y-1">
                                    {isRedirecting ? (
                                        <>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Redirecting to payment verification...
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-300">
                                                Please wait and do not close this window. We are
                                                redirecting you to the payment verification page.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Payment is being processed...
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-300">
                                                Please wait and do not close this window. A payment
                                                gateway window may open - complete your payment
                                                there and you will be redirected automatically.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className={isProcessing || isRedirecting ? 'opacity-50 pointer-events-none' : ''}>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3">
                        <Button
                            variant="outline"
                            className="p-4 h-auto justify-start hover:bg-accent/20 dark:hover:bg-accent/20 dark:hover:text-accent disabled:opacity-50"
                            onClick={() => handlePaymentSelect(PaymentProvider.RAZORPAY)}
                            disabled={!canProceed || isProcessing || isRedirecting}
                        >
                            <CreditCard className="mr-3 h-5 w-5" />
                            <div className="text-left">
                                <div className="font-medium">Razorpay</div>
                                <div className="text-sm text-muted-foreground">
                                    Cards, UPI, Net Banking
                                </div>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="p-4 h-auto justify-start hover:bg-accent/20 dark:hover:bg-accent/20 dark:hover:text-accent disabled:opacity-50"
                            onClick={() => handlePaymentSelect(PaymentProvider.CASHFREE)}
                            disabled={!canProceed}
                        >
                            <CreditCard className="mr-3 h-5 w-5" />
                            <div className="text-left">
                                <div className="font-medium">Cashfree</div>
                                <div className="text-sm text-muted-foreground">
                                    Secure payment gateway
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
