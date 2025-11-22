import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Key = (props: HTMLAttributes<HTMLDivElement>) => {
    const { className, children, ...rest } = props;
    return (
        <div
            className={twMerge(
                'size-14 bg-secondary inline-flex items-center justify-center rounded-2xl text-xl text-secondary-foreground font-[550]',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Key;
