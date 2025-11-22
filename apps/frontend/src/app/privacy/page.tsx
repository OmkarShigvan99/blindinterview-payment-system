import { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { BRAND_INFO } from '@shared/constants/brand';

export const metadata: Metadata = {
    title: `Privacy Policy - ${BRAND_INFO.DISPLAY_NAME}`,
    description: `Privacy policy explaining how ${BRAND_INFO.DISPLAY_NAME} collects, uses, and protects your personal information.`,
    robots: 'index, follow',
};

export default function PrivacyPage() {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            lastUpdated="August 2025"
            breadcrumbs={[{ label: 'Legal', href: '/privacy' }]}
        >
            <div className="space-y-8">
                <section>
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                        This privacy policy sets out how BlindInterview uses and protects any
                        information that you provide when you visit our website and/or agree to
                        purchase from us.
                    </p>
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                        BlindInterview is committed to ensuring that your privacy is protected.
                        Should we ask you to provide certain information by which you can be
                        identified when using this website, you can be assured that it will only be
                        used in accordance with this privacy statement.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        BlindInterview may update this policy from time to time by updating this
                        page. You should review this page periodically to ensure that you are aware
                        of any changes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Information We May Collect
                    </h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We may collect the following types of information when you use our website
                        or software:
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-foreground">
                                Contact Information
                            </h3>
                            <p className="text-muted-foreground leading-relaxed ml-4">
                                Such as your email address and phone number.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2 text-foreground">
                                Technical and Device Information
                            </h3>
                            <p className="text-muted-foreground leading-relaxed ml-4">
                                Including your IP address, device type, operating system, and
                                browser details.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2 text-foreground">
                                Location Data
                            </h3>
                            <p className="text-muted-foreground leading-relaxed ml-4">
                                Your approximate location (e.g., country), inferred from your IP
                                address.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2 text-foreground">Usage Data</h3>
                            <p className="text-muted-foreground leading-relaxed ml-4">
                                Information about how you interact with our software, including
                                hotkeys or shortcuts used, feature usage patterns, and session
                                activity.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        How We Use the Information
                    </h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We collect this information to better understand your needs and provide you
                        with improved service. Specifically, we may use the information for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                        <li>Internal record keeping</li>
                        <li>Improving our services</li>
                        <li>
                            Sending promotional emails about new services, special offers, or other
                            information we think you may find interesting
                        </li>
                        <li>
                            Contacting you for market research purposes (by email, phone, or other
                            means)
                        </li>
                        <li>Customizing the website based on your preferences</li>
                    </ul>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        We are committed to ensuring that your information is secure. To prevent
                        unauthorized access or disclosure, we have implemented appropriate physical,
                        electronic, and managerial procedures.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Use of Cookies</h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We use cookies solely for session management purposes. A cookie is a small
                        file stored on your device that helps us maintain your login session and
                        ensure secure access to our services.
                    </p>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2 text-foreground">
                            These session cookies:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed">
                            <li>Help recognize you once you&apos;ve logged in</li>
                            <li>
                                Ensure that you stay logged in as you navigate through the site or
                                software
                            </li>
                            <li>Expire automatically after a set period or when you log out</li>
                        </ul>
                    </div>

                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We do not use cookies for tracking your behavior across the web or for
                        personalized advertising.
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                        You can control cookie behavior through your browser settings, but disabling
                        cookies may limit your ability to access certain features of our service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Controlling Your Personal Information
                    </h2>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        You may choose to restrict the collection or use of your personal
                        information by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed mb-4">
                        <li>Clicking opt-out options wherever available during form submissions</li>
                        <li>
                            Contacting us at{' '}
                            <span className="text-primary font-medium">
                                team@blindinterview.com
                            </span>{' '}
                            if you previously agreed to receive marketing and wish to withdraw that
                            consent
                        </li>
                    </ul>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We will not sell, distribute, or lease your personal information to third
                        parties unless we have your explicit permission or are required by law to do
                        so.
                    </p>
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        We may use your personal information to send you promotional information
                        about third parties only if you have explicitly opted in to receive such
                        communication.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        If you believe that any information we hold about you is incorrect or
                        incomplete, please contact us at{' '}
                        <span className="text-primary font-medium">team@blindinterview.com</span>{' '}
                        and we will promptly correct or update it.
                    </p>
                </section>

                <section className="mt-8">
                    <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                            Contact Information
                        </h3>
                        <p className="text-muted-foreground mb-2">
                            For any privacy-related questions or concerns, please contact us:
                        </p>
                        <p className="text-primary font-medium">📧 team@blindinterview.com</p>
                    </div>
                </section>

                <section className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This Privacy Policy is effective as of the last
                        updated date shown above. We are committed to protecting your privacy and
                        will continue to update our practices to ensure the highest level of data
                        protection.
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
