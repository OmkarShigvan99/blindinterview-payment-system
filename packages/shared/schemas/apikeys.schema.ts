import { z } from 'zod';

export const updateTokensSchema = z.object({
    index: z.number().int().min(0, 'API key index must be a non-negative integer'),
    tokensUsed: z.number().int().min(0, 'Tokens used must be a non-negative integer'),
});

export type UpdateTokensRequest = z.infer<typeof updateTokensSchema>;
