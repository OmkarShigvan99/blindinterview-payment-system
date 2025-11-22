import { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { BRAND_INFO } from '@shared/constants/brand';

export const metadata: Metadata = {
    title: `Terms and Conditions - ${BRAND_INFO.DISPLAY_NAME}`,
    description: `Terms and conditions for using ${BRAND_INFO.DISPLAY_NAME} AI-powered interview platform.`,
    robots: 'index, follow',
};

export default function TermsPage() {
    return (
        <LegalPageLayout
            title="Terms and Conditions"
            lastUpdated="January 2025"
            breadcrumbs={[{ label: 'Legal', href: '/terms' }]}
        >
            <div className="space-y-8">
                <section>
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                        For the purpose of these Terms and Conditions, the terms &quot;we&quot;,
                        &quot;us&quot;, and &quot;our&quot; shall refer to BlindInterview. The terms
                        &quot;you&quot;, &quot;your&quot;, &quot;user&quot;, and &quot;visitor&quot;
                        shall refer to any natural or legal person who visits our website and/or
                        agrees to purchase from us. Your use of this website and/or purchase from us
                        is governed by the following Terms and Conditions:
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Website Content</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The content of the pages of this website is subject to change without
                        notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Warranties and Liability
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Neither we nor any third parties provide any warranty or guarantee as to the
                        accuracy, timeliness, performance, completeness, or suitability of the
                        information and materials found or offered on this website for any
                        particular purpose. You acknowledge that such information and materials may
                        contain inaccuracies or errors and we expressly exclude liability for any
                        such inaccuracies or errors to the fullest extent permitted by law.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Your use of any information or materials on our website and/or product pages
                        is entirely at your own risk, for which we shall not be liable. It shall be
                        your own responsibility to ensure that any products, services, or
                        information available through our website and/or product pages meet your
                        specific requirements.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Intellectual Property
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        This website contains material which is owned by or licensed to us. This
                        material includes, but is not limited to, the design, layout, look,
                        appearance, and graphics. Reproduction is prohibited other than in
                        accordance with the copyright notice, which forms part of these Terms and
                        Conditions.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        All trademarks reproduced on this website which are not the property of, or
                        licensed to, the operator are acknowledged on the website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Unauthorized Use</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Unauthorized use of any information provided by us shall give rise to a
                        claim for damages and/or may constitute a criminal offense.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">External Links</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        From time to time, this website may also include links to other websites.
                        These links are provided for your convenience to provide further
                        information. You may not create a link to this website from another website
                        or document without BlindInterview&apos;s prior written consent.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Governing Law</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Any dispute arising out of the use of this website and/or purchases made
                        through it shall be subject to the laws of India.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        Payment Authorization
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We shall be under no liability whatsoever in respect of any loss or damage
                        arising directly or indirectly out of the decline of authorization for any
                        transaction, on account of the cardholder having exceeded the preset limit
                        mutually agreed upon by us and our acquiring bank from time to time.
                    </p>
                </section>

                <section className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> These Terms and Conditions are effective as of the
                        last updated date shown above. We encourage you to review these Terms
                        periodically for any changes. Your continued use of the Service after any
                        modifications constitutes acceptance of the updated Terms.
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
