'use client';
import Tag from '@/components/home/Tag';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const faqs = [
    {
        question: 'Do I need to know coding already?',
        answer: 'Basic programming knowledge helps, but BlindInterview is beginner-friendly. We will help you with the code while running in live interview and you just have to type by seeing it.',
    },
    {
        question: 'Is BlindInterview free?',
        answer: 'We offer a mix of free and premium features. You can get weekly 5 credits, in which you can explore basic LLM models at less credits cost, and buy some more credits and get premium llm models to help you.',
    },
    {
        question: 'Is this legal or ethical?',
        answer: 'Absolutely. BlindInterview is a preparation and learning tool designed to help candidates develop their skills and knowledge. We promote ethical interview preparation through smart learning strategies and comprehensive content tailored to interview success.',
    },
    {
        question: 'What if I fail the interview even after using BlindInterview?',
        answer: "That's okay. We're here for the long haul. You'll get feedback, and continued access to BlindInterview. Failing once doesn't mean failing forever we're with you until you win.",
    },
];

export default function Faqs() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    return (
        <section className="py-24" id="FAQs">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>FAQs</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6 max-w-xl mx-auto">
                    Questions? We&apos;ve got <span className="text-primary">answers</span>
                </h2>
                <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div
                            className="bg-card rounded-2xl border border-border p-6"
                            key={faq.question}
                        >
                            <div
                                className="flex justify-between items-center"
                                onClick={() => {
                                    setSelectedIndex(index);
                                }}
                            >
                                <h3 className="font-[550]"> {faq.question}</h3>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={twMerge(
                                        'feather feather-plus text-primary flex-shrink-0 transition duration-500',
                                        selectedIndex === index && 'rotate-45',
                                    )}
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                            <AnimatePresence>
                                {selectedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, marginTop: 0 }}
                                        animate={{ height: 'auto', marginTop: 24 }}
                                        exit={{ height: 0, marginTop: 0 }}
                                        className={twMerge('mt-6 overflow-hidden')}
                                    >
                                        <p className="text-muted-foreground"> {faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
