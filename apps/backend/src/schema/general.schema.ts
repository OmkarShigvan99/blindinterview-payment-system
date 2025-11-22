import { z } from 'zod';

// id schema
export const idSchema = z.object({
    id: z
        .string()
        .min(1, { message: 'ID is required' })
        .regex(/^[a-f0-9]{24}$/, { message: 'Invalid ID format' }),
});
