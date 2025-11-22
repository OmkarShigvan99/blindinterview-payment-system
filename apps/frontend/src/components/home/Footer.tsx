import Image from 'next/image';
// Logo image is now served from public/assets/ui-icons/logo2.png

const footerLinks = [
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/refund-policy', label: 'Refund Policy' },
];

export default function Footer() {
    return (
        <section className="py-16">
            <div className="container">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <div className="">
                        <Image
                            src="/assets/ui-icons/logo.svg"
                            alt="logo"
                            className=""
                            width={200}
                            height={32}
                        />
                    </div>
                    <div className="">
                        <nav className="flex gap-6">
                            {footerLinks.map((link, index) => {
                                return (
                                    <a
                                        href={link.href}
                                        key={index}
                                        className="text-muted-foreground text-sm"
                                    >
                                        {link.label}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}
