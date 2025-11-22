import { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { BRAND_INFO } from '@shared/constants/brand';

export const metadata: Metadata = {
    title: `No Refund Policy - ${BRAND_INFO.DISPLAY_NAME}`,
    description: `No refund policy for ${BRAND_INFO.DISPLAY_NAME} AI-powered interview platform services. All sales are final.`,
    robots: 'index, follow',
};

export default function RefundPolicyPage() {
    return (
        <LegalPageLayout
            title="No Refund Policy"
            lastUpdated="August 2025"
            breadcrumbs={[{ label: 'Legal', href: '/refund-policy' }]}
        >
            <div className="space-y-8">
                <section>
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                        At BlindInterview, we provide AI-powered interview software services. Due to
                        the digital nature of our services and immediate access provided upon
                        purchase, we maintain a strict no-refund policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">No Refund Policy</h2>
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                        <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
                            🚫 Important Notice
                        </h3>
                        <p className="text-red-700 dark:text-red-300 font-medium">
                            All purchases are final. We do not offer refunds, cancellations, or
                            exchanges for any of our services.
                        </p>
                    </div>

                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        This policy is in place because:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                        <li>
                            <strong>Instant Digital Access</strong> - Our service is delivered
                            immediately upon purchase
                        </li>
                        <li>
                            <strong>Software-Based Service</strong> - No physical products are
                            involved
                        </li>
                        <li>
                            <strong>Immediate Value Delivery</strong> - You gain access to all
                            features instantly
                        </li>
                        <li>
                            <strong>Resource Allocation</strong> - Credits and features are
                            allocated immediately to your account
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Before You Purchase
                    </h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We strongly encourage you to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                        <li>Review our service features and pricing carefully</li>
                        <li>Try our free tier to understand the platform</li>
                        <li>Read our Terms and Conditions thoroughly</li>
                        <li>Contact our support team if you have any questions</li>
                        <li>Ensure the service meets your specific requirements</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Technical Support</h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        While we don&apos;t offer refunds, we are committed to ensuring you have the
                        best experience with our platform:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                        <li>Free technical support for all users</li>
                        <li>Assistance with account setup and feature usage</li>
                        <li>Troubleshooting for any technical issues</li>
                        <li>Guidance on maximizing the value of your plan</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Billing Disputes</h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        For genuine billing errors or unauthorized charges:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                        <li>
                            Contact our support team immediately at{' '}
                            <span className="text-primary font-medium">
                                team@blindinterview.com
                            </span>
                        </li>
                        <li>Provide detailed information about the billing issue</li>
                        <li>Include transaction details and relevant documentation</li>
                        <li>We will investigate and resolve legitimate billing errors promptly</li>
                    </ol>
                </section>

                <section className="mt-8">
                    <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                            Contact Information
                        </h3>
                        <p className="text-muted-foreground mb-2">
                            For any questions about our no-refund policy or technical support:
                        </p>
                        <p className="text-primary font-medium">📧 team@blindinterview.com</p>
                    </div>
                </section>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <section className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
                            🚫 No Refunds
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            All sales are final. Please carefully review your purchase before
                            completing the transaction. Our digital services are delivered instantly
                            upon payment.
                        </p>
                    </section>

                    <section className="p-4 bg-secondary/50 rounded-lg border">
                        <h3 className="font-semibold mb-2">💬 Need Help?</h3>
                        <p className="text-sm text-muted-foreground">
                            Our support team is available to help you get the most out of our
                            platform. Contact us at team@blindinterview.com for any assistance or
                            questions.
                        </p>
                    </section>
                </div>
            </div>
        </LegalPageLayout>
    );
}
