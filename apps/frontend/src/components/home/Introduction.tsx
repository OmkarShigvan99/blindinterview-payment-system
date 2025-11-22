'use client';
import Tag from '@/components/home/Tag';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const text = `Interview preparation should be smart and focused. BlindInterview helps you prepare efficiently for technical interviews by providing targeted guidance on coding problems, system design, and behavioral questions — without wasting time on irrelevant content.`;
const finalText = `That's why we built BlindInterview.`;
const words = text.split(' ');

export default function Introduction() {
    const scrollTarget = useRef<HTMLDivElement | null>(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { scrollYProgress } = useScroll({
        target: scrollTarget,
        offset: ['start end', 'end end'],
    });
    const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

    useEffect(() => {
        wordIndex.on('change', (value) => {
            setCurrentWordIndex(value);
        });
    }, [wordIndex]);

    return (
        <section className="py-28 lg:py-40">
            <div className="container">
                <div className="sticky top-20 md:top-28 lg:top-40">
                    <div className="flex justify-center">
                        <Tag className="">introducing BlindInterview</Tag>
                    </div>
                    <div className="text-4xl md:text-6xl lg:text-6xl text-center font-medium mt-10">
                        <span className="">
                            {words.map((word, index) => (
                                <span
                                    className={twMerge(
                                        'transition duration-500 text-muted-foreground/40',
                                        currentWordIndex > index && 'text-foreground',
                                    )}
                                    key={index}
                                >
                                    {`${word} `}
                                </span>
                            ))}
                        </span>
                        <motion.span
                            className={twMerge(
                                'text-primary block mt-4 transition-opacity duration-500',
                                currentWordIndex >= words.length ? 'opacity-100' : 'opacity-10',
                            )}
                        >
                            {finalText}
                        </motion.span>
                    </div>
                </div>
                <div className="h-[150vh]" ref={scrollTarget} />
            </div>
        </section>
    );
}
