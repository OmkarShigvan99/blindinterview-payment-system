import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Tag = (props: HTMLAttributes<HTMLDivElement>) => {
    const { className, children, ...rest } = props;
    return (
        <div
            className={twMerge(
                'inline-flex border border-lime-600/50 bg-lime-500/15 gap-2 text-lime-700 font-semibold px-3 py-1 rounded-full uppercase items-center dark:border-lime-400/70 dark:bg-transparent dark:text-lime-400',
                className,
            )}
            {...rest}
        >
            <span>&#10038;</span>
            <span className="text-sm">{children}</span>
        </div>
    );
};

export default Tag;
