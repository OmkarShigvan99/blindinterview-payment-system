'use client';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { type IntegrationsType } from '@/components/home/Integrations';

const IntegrationsColumn = (props: {
    integrations: IntegrationsType;
    className?: string;
    reverse?: boolean;
}) => {
    const { integrations, className, reverse } = props;
    return (
        <motion.div
            initial={{
                y: reverse ? '-50%' : 0,
            }}
            animate={{
                y: reverse ? 0 : '-50%',
            }}
            transition={{
                duration: 15,
                ease: 'linear',
                repeat: Infinity,
            }}
            className={twMerge('flex flex-col gap-4 pb-4', className)}
        >
            {Array.from({ length: 2 }).map((_, index) => {
                return (
                    <Fragment key={index}>
                        {integrations.map((integration) => (
                            <div
                                key={integration.name}
                                className="bg-card border border-border rounded-3xl p-6 "
                            >
                                <div className="flex justify-center">
                                    <Image
                                        src={integration.icon}
                                        alt={integration.name}
                                        className="size-24"
                                        height={24}
                                        width={24}
                                    />
                                </div>
                                <h3 className="text-3xl text-center mt-6">{integration.name}</h3>
                                <p className="text-center text-muted-foreground mt-2 ">
                                    {' '}
                                    {integration.description}
                                </p>
                            </div>
                        ))}
                    </Fragment>
                );
            })}
        </motion.div>
    );
};

export default IntegrationsColumn;
