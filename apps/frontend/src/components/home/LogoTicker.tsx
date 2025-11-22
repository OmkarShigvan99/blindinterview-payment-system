'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
// Company logos are now served from public/assets/company-logos/
import { useTheme } from '@/hooks/useTheme';

const logos = [
    {
        name: 'Capgemini',
        image: '/assets/company-logos/capgemini.svg',
        darkImage: '/assets/company-logos/capgemini.dark.svg',
    },
    {
        name: 'TCS',
        image: '/assets/company-logos/tsc.svg',
        darkImage: '/assets/company-logos/tsc.dark.svg',
    },
    {
        name: 'Goldman Sachs',
        image: '/assets/company-logos/goldman-sachs.svg',
        darkImage: '/assets/company-logos/goldman-sachs.dark.svg',
    },
    {
        name: 'Deloitte',
        image: '/assets/company-logos/deloitte.svg',
        darkImage: '/assets/company-logos/deloitte.dark.svg',
    },
    {
        name: 'IBM',
        image: '/assets/company-logos/ibm.svg',
        darkImage: '/assets/company-logos/ibm.dark.svg',
    },
    {
        name: 'Infosys',
        image: '/assets/company-logos/infosys.svg',
        darkImage: '/assets/company-logos/infosys.dark.svg',
    },
    {
        name: 'Wipro',
        image: '/assets/company-logos/wipro.svg',
        darkImage: '/assets/company-logos/wipro.dark.svg',
    },
    {
        name: 'Cognizant',
        image: '/assets/company-logos/cognizant.svg',
        darkImage: '/assets/company-logos/cognizant.dark.svg',
    },
];

export default function LogoTicker() {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="py-24 overflow-x-clip">
            <div className="container">
                <h3 className="text-center text-muted-foreground text-xl">
                    Helping candidates succeed at top companies
                </h3>
                <div className="flex overflow-hidden mt-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <motion.div
                        animate={{
                            x: '-50%',
                        }}
                        transition={{
                            duration: 30,
                            ease: 'linear',
                            repeat: Infinity,
                        }}
                        className="flex flex-none gap-24 pr-24"
                    >
                        {Array.from({ length: 2 }).map((_, index) => {
                            return (
                                <Fragment key={index}>
                                    {isMounted &&
                                        logos.map((logo) => (
                                            <Image
                                                key={logo.name}
                                                src={theme === 'dark' ? logo.darkImage : logo.image}
                                                alt={logo.name}
                                                width={100}
                                                height={100}
                                                className="w-auto h-auto max-w-[100px] max-h-[100px] object-contain"
                                            />
                                        ))}
                                </Fragment>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
