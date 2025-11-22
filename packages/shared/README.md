# Shared Package

Common types, schemas, and utilities shared between frontend and backend.

## Overview

This package contains shared code used by both the frontend and backend applications:

- **TypeScript types** - Common interfaces and type definitions
- **Zod schemas** - Validation schemas for API requests/responses
- **Utility functions** - Helper functions used across applications
- **Constants** - Shared constants and enums

## Development

```bash
# Build the shared package (required after changes)
pnpm build --filter=@blindinterview/shared

# Or from this directory
cd packages/shared
pnpm build

# Type check
pnpm type-check
```

**Important**: The shared package must be built after making changes for other packages to see the updates.

## Project Structure

```
├── schemas/                # Zod validation schemas
│   ├── user.schema.ts      # User-related schemas
│   ├── order.schema.ts     # Order-related schemas
│   ├── apikeys.schema.ts   # API key schemas
│   └── pricing-tier.schema.ts
├── types/                  # TypeScript type definitions
│   ├── user.ts            # User types
│   ├── order.ts           # Order types
│   └── pricingTier.ts      # Pricing tier types
├── utils/                  # Utility functions
│   ├── country.utils.ts    # Country code utilities
│   ├── currency.utils.ts   # Currency utilities (with fuzzy matching)
│   └── enum-values.ts      # Enum helper functions
├── index.ts               # Main export file
├── package.json           # Package configuration
└── tsconfig.json          # TypeScript configuration
```

## Usage

### Importing Shared Code

```typescript
// In backend (apps/backend/src/)
import { UserDTO, createUserSchema, validateEmail } from '@blindinterview/shared';

// In frontend (apps/frontend/src/)
import { OrderStatus, updateOrderSchema, formatCurrency } from '@blindinterview/shared';
```

### Types

```typescript
// packages/shared/types/user.ts
export interface UserDTO {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
}

// Usage in other packages
import { UserDTO, CreateUserRequest } from '@blindinterview/shared';
```

### Schemas

```typescript
// packages/shared/schemas/user.schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    avatar: z.string().url().optional(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

// Usage in backend
import { createUserSchema } from '@blindinterview/shared';

app.post('/users', validate(createUserSchema), createUser);

// Usage in frontend
import { createUserSchema, type CreateUserRequest } from '@blindinterview/shared';

const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
});
```

### Utilities

```typescript
// packages/shared/utils/currency.utils.ts
export type CurrencyCode = 'USD' | 'EUR' | 'INR' | 'GBP';

export function formatCurrency(amount: number, currency: CurrencyCode): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

export function toMinorUnit(amount: number, currency: CurrencyCode): number {
    // Convert to smallest currency unit (cents, paise, etc.)
    const multipliers = { USD: 100, EUR: 100, INR: 100, GBP: 100 };
    return Math.round(amount * multipliers[currency]);
}

export function resolveCurrencyCode(input: string): string | null {
    // Fuzzy matching using Levenshtein distance for currency code resolution
    // Useful for resolving partial or misspelled currency inputs
    const codes = getAllCurrencyCodes();
    return findBestMatch(input, codes, 0.8); // 80% similarity threshold
}

// Usage
import { formatCurrency, toMinorUnit, resolveCurrencyCode } from '@blindinterview/shared';

const displayAmount = formatCurrency(99.99, 'USD'); // "$99.99"
const razorpayAmount = toMinorUnit(99.99, 'INR'); // 9999
const resolvedCode = resolveCurrencyCode('dollar'); // 'USD'
```

## Adding New Shared Code

### 1. Adding Types

```typescript
// Create new type file
// packages/shared/types/example.ts
export interface ExampleDTO {
    id: string;
    name: string;
    value: number;
}

// Export from index.ts
// packages/shared/index.ts
export * from './types/example';
```

### 2. Adding Schemas

```typescript
// Create new schema file
// packages/shared/schemas/example.schema.ts
import { z } from 'zod';

export const createExampleSchema = z.object({
    name: z.string().min(1),
    value: z.number().positive(),
});

export type CreateExampleRequest = z.infer<typeof createExampleSchema>;

// Export from index.ts
// packages/shared/index.ts
export * from './schemas/example.schema';
```

### 3. Adding Utilities

```typescript
// Create new utility file
// packages/shared/utils/example.utils.ts
export function processExample(data: string): string {
    return data.toUpperCase().trim();
}

// Export from index.ts
// packages/shared/index.ts
export * from './utils/example.utils';
```

### 4. Build and Use

```bash
# Build shared package
pnpm build --filter=@blindinterview/shared

# Now use in other packages
import { ExampleDTO, createExampleSchema, processExample } from '@blindinterview/shared';
```

## Scripts

```bash
pnpm build            # Build TypeScript to dist/
pnpm type-check       # Check TypeScript types
pnpm format           # Format code with Prettier
```

## Key Files

- **`index.ts`** - Main export file (all exports go through here)
- **`package.json`** - Package configuration with build scripts
- **`tsconfig.json`** - TypeScript configuration for building

## Build Output

The built package is output to `dist/` directory with:

- Compiled JavaScript files
- TypeScript declaration files (`.d.ts`)
- Source maps for debugging

## Dependencies

This package has minimal dependencies:

- **zod** - Schema validation
- **TypeScript** - Type definitions
- Utility libraries as needed

## Best Practices

1. **Keep it focused**: Only include truly shared code
2. **Export everything through index.ts**: Centralized exports
3. **Use descriptive names**: Clear, specific naming
4. **Document complex utilities**: Add JSDoc comments
5. **Version carefully**: Breaking changes affect all packages
6. **Build after changes**: Always build before testing in other packages

## Examples

### Complete Feature Example

```typescript
// 1. Define types
// packages/shared/types/blog.ts
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    authorId: string;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
}

// 2. Create schemas
// packages/shared/schemas/blog.schema.ts
import { z } from 'zod';

export const createBlogPostSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    status: z.enum(['draft', 'published']).default('draft'),
});

export type CreateBlogPostRequest = z.infer<typeof createBlogPostSchema>;

// 3. Add utilities
// packages/shared/utils/blog.utils.ts
import { BlogPost } from '../types/blog';

export function getPostExcerpt(post: BlogPost, length = 150): string {
    return post.content.length > length ? post.content.substring(0, length) + '...' : post.content;
}

export function isPublished(post: BlogPost): boolean {
    return post.status === 'published' && !!post.publishedAt;
}

// 4. Export everything
// packages/shared/index.ts
export * from './types/blog';
export * from './schemas/blog.schema';
export * from './utils/blog.utils';

// 5. Use in backend
// apps/backend/src/controllers/blog.controller.ts
import {
    BlogPost,
    createBlogPostSchema,
    CreateBlogPostRequest,
    getPostExcerpt,
} from '@blindinterview/shared';

// 6. Use in frontend
// apps/frontend/src/components/BlogCard.tsx
import { BlogPost, getPostExcerpt, isPublished } from '@blindinterview/shared';
```

This shared package is the foundation for maintaining consistency and reducing duplication across the entire monorepo!
