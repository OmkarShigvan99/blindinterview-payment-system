'use client';
import Image from 'next/image';
import Pointer from '@/components/home/Pointer';
import { motion, useAnimate } from 'framer-motion';
import { useEffect } from 'react';

export default function Hero() {
    const [leftDesignScope, leftDesignAnimate] = useAnimate();
    const [leftPointerScope, leftPointerAnimate] = useAnimate();
    const [rightDesignScope, rightDesignAnimate] = useAnimate();
    const [rightPointerScope, rightPointerAnimate] = useAnimate();

    useEffect(() => {
        leftDesignAnimate([
            [leftDesignScope.current, { opacity: [1] }, { duration: 0.5 }],
            [leftDesignScope.current, { x: 0, y: 0 }, { duration: 0.5 }],
        ]);
        leftPointerAnimate([
            [leftPointerScope.current, { opacity: [1] }, { duration: 0.5 }],
            [leftPointerScope.current, { x: -100, y: 0 }, { duration: 0.5 }],
            [
                leftPointerScope.current,
                { x: 0, y: [0, 16, 0] },
                { duration: 0.5, ease: 'easeInOut' },
            ],
        ]);
        rightDesignAnimate([
            [rightDesignScope.current, { opacity: [1] }, { duration: 0.5, delay: 1.5 }],
            [rightDesignScope.current, { x: 0, y: 0 }, { duration: 0.5 }],
        ]);
        rightPointerAnimate([
            [rightPointerScope.current, { opacity: [1] }, { duration: 0.5, delay: 1.5 }],
            [rightPointerScope.current, { x: 175, y: 0 }, { duration: 0.5 }],
            [
                rightPointerScope.current,
                { x: 0, y: [0, 20, 0] },
                { duration: 0.5, ease: 'easeInOut' },
            ],
        ]);
    }, [
        leftDesignAnimate,
        leftDesignScope,
        leftPointerAnimate,
        leftPointerScope,
        rightDesignAnimate,
        rightDesignScope,
        rightPointerAnimate,
        rightPointerScope,
    ]);
    return (
        <section
            className="py-24 overflow-x-clip"
            style={{
                cursor: 'url(/assets/ui-icons/cursor-you.svg), auto',
            }}
            id="Home"
        >
            <div className="container relative">
                <motion.div
                    ref={leftDesignScope}
                    drag
                    dragSnapToOrigin={true}
                    initial={{ opacity: 0, x: -100, y: 100 }}
                    dragElastic={1}
                    className="absolute -left-32 top-16 hidden lg:block"
                >
                    <Image
                        className="opacity-70 w-auto h-[30rem] object-contain"
                        src="/assets/ui-icons/hero-image1.svg"
                        alt="design example 1"
                        draggable={false}
                        width={400}
                        height={400}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -200, y: 100 }}
                    ref={leftPointerScope}
                    className="absolute left-56 top-96 hidden lg:block"
                >
                    <Pointer name="Martin" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 100, y: 100 }}
                    ref={rightDesignScope}
                    drag
                    dragSnapToOrigin={true}
                    className="absolute -right-64 -top-16 hidden lg:block"
                >
                    <Image
                        className="opacity-70 w-auto h-[30rem] object-contain"
                        src="/assets/ui-icons/hero-image2.svg"
                        alt="design example 2"
                        draggable={false}
                        width={400}
                        height={400}
                    />
                </motion.div>

                <motion.div
                    ref={rightPointerScope}
                    initial={{ opacity: 0, x: 275, y: 100 }}
                    className="absolute right-80 -top-4 hidden lg:block"
                >
                    <Pointer name="Chris" color="red" />
                </motion.div>
                <div className="flex justify-center">
                    <div className="inline-flex py-1 px-3 bg-gradient-to-r from-primary to-secondary rounded-full text-primary-foreground font-semibold">
                        💫 An IITian Startup
                    </div>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6 ">
                    Beat the System, Get the Job.
                </h1>
                <p className="text-center text-xl text-muted-foreground mt-8 max-w-2xl mx-auto">
                    {
                        "Tech interviews are broken we're not here to fix them, we're here to beat them. BlindInterview shows you what to say, what to solve, and how to walk away with the offer."
                    }
                </p>
            </div>
        </section>
    );
}
