import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const buttonVariants = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

interface PaginationProps {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    loading: boolean;
    onPageChange: (page: number) => void;
}

export function OrdersPagination({
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    loading,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:items-center sm:gap-4 sm:space-y-0 pt-6">
            <div className="flex justify-center items-center gap-3 sm:gap-4">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasPrevPage || loading}
                        onClick={() => onPageChange(page - 1)}
                        className="flex-1 sm:flex-none hover:text-primary hover:bg-primary/10 hover:border-primary"
                    >
                        Previous
                    </Button>
                </motion.div>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap px-2">
                    {page} / {totalPages}
                </span>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasNextPage || loading}
                        onClick={() => onPageChange(page + 1)}
                        className="flex-1 sm:flex-none hover:text-primary hover:bg-primary/10 hover:border-primary"
                    >
                        Next
                    </Button>
                </motion.div>
            </div>
            <span className="text-xs text-center text-muted-foreground sm:hidden">
                Page {page} of {totalPages}
            </span>
        </div>
    );
}
