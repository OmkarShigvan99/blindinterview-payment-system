'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import Tag from '@/components/home/Tag';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Button = ({ label, href, icon }: { label: string; href: string; icon: IconProp }) => {
    return (
        <motion.a
            href={href}
            download
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-2xl shadow-[0_0_20px_var(--primary)] hover:bg-primary/80 transition duration-300 text-sm sm:text-base w-full sm:w-auto"
        >
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
            {label}
        </motion.a>
    );
};

export default function Downloads() {
    const windowsDownloadUrl = process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL;
    const macosDownloadUrl = process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL;

    return (
        <section className="py-24" id="FAQs">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Downloads</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6 max-w-xl mx-auto">
                    Wanna Download? Here&apos;s our <span className="text-primary">software</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-10 justify-center mt-10">
                    {windowsDownloadUrl ? (
                        <Button label="Download" href={windowsDownloadUrl} icon={faWindows} />
                    ) : (
                        <div className="flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold px-6 py-3 rounded-2xl border-2 border-dashed border-muted-foreground/30 text-sm sm:text-base w-full sm:w-auto">
                            <FontAwesomeIcon icon={faWindows} className="w-4 h-4" />
                            Coming Soon
                        </div>
                    )}
                    {macosDownloadUrl ? (
                        <Button label="Download" href={macosDownloadUrl} icon={faApple} />
                    ) : (
                        <div className="flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold px-6 py-3 rounded-2xl border-2 border-dashed border-muted-foreground/30 text-sm sm:text-base w-full sm:w-auto">
                            <FontAwesomeIcon icon={faApple} className="w-4 h-4" />
                            Coming Soon
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
