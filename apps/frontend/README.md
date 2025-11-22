# Frontend Web Application

Next.js web application for the BlindInterview platform.

## Overview

This package contains the frontend web application built with:

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form state management
- **Framer Motion** - Animation library
- **FontAwesome** - Icon library
- **Zod** - Validation (via shared package)
- **Axios** - HTTP client for API calls

## Development

```bash
# From root directory
pnpm dev:frontend

# Or from this directory
cd apps/frontend
pnpm dev
```

The application will start on `http://localhost:3000` with hot reload enabled.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-related pages (route groups)
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── verify-email/  # Email verification
│   │   └── layout.tsx     # Auth layout
│   ├── profile/           # User profile management
│   │   ├── edit/          # Profile editing
│   │   └── page.tsx       # Profile view
│   ├── orders/            # Order management
│   │   ├── [id]/          # Order details
│   │   └── page.tsx       # Order list
│   ├── buy/               # Purchase flow
│   │   ├── credits/       # Credit purchase
│   │   └── page.tsx       # Purchase options
│   ├── api/               # API routes (if any)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── forms/            # Form components
│   │   ├── auth-forms.tsx
│   │   ├── profile-form.tsx
│   │   └── order-form.tsx
│   ├── layouts/          # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   └── sections/         # Page sections
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   ├── use-api.ts        # API calling hook
│   └── use-local-storage.ts # Local storage hook
├── utils/                # Utility functions
│   ├── api.ts            # API client configuration
│   ├── auth.ts           # Auth utilities
│   ├── format.ts         # Formatting helpers
│   └── validators.ts     # Custom validators
├── types/                # Frontend-specific types
│   ├── api.ts            # API response types
│   ├── auth.ts           # Auth types
│   └── global.ts         # Global types
├── lib/                  # External library configs
│   ├── axios.ts          # Axios configuration
│   └── utils.ts          # Utility functions
├── fetch/                # API fetch functions
│   ├── auth.ts           # Auth API calls
│   ├── orders.ts         # Order API calls
│   └── users.ts          # User API calls
├── dialog/               # Dialog components
│   ├── confirm-dialog.tsx
│   └── alert-dialog.tsx
└── sections/             # Page sections
    ├── hero.tsx
    ├── features.tsx
    └── pricing.tsx
public/
├── assets/               # Static assets
│   ├── images/           # Image files
│   ├── icons/            # Icon files
│   └── avatars/          # Default avatars
├── favicon.ico           # Favicon
└── manifest.json         # PWA manifest
```

## Key Features

- **Authentication**: Secure login, registration, and email verification
- **Profile Management**: Comprehensive user profile editing and management
- **Order System**: Course purchases, credit system, and order tracking
- **Responsive Design**: Mobile-first responsive layouts with Tailwind CSS
- **Dark Mode**: Theme switching capability with next-themes
- **Form Handling**: Validated forms with React Hook Form and Zod schemas
- **Component Library**: Reusable UI components built with Radix UI
- **Animations**: Smooth animations with Framer Motion
- **API Integration**: Type-safe API calls with shared TypeScript types
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Elegant loading indicators and skeleton screens
- **Accessibility**: WCAG compliant components and keyboard navigation

## Pages & Routes

### Public Routes

- `/` - Landing page with hero section and features
- `/login` - User login with JWT authentication
- `/register` - User registration with email verification
- `/verify-email` - Email verification flow
- `/reset-password` - Password reset functionality

### Protected Routes

- `/profile` - User profile dashboard
- `/profile/edit` - Profile editing interface
- `/orders` - Order history and management
- `/orders/[id]` - Individual order details
- `/buy` - Purchase flow for credits/courses
- `/buy/credits` - Credit purchase interface
- `/api-keys` - API key management (if applicable)

## Environment Variables

Create `.env` file in this directory for Docker deployment, or `.env.local` for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8501
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_JWT_TOKEN_KEY=blindinterview_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=blindinterview_refresh_token

# Payment Integration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-public-key
NEXT_PUBLIC_CASHFREE_APP_ID=your-cashfree-app-id

# Feature Flags
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=false

# Analytics (if used)
NEXT_PUBLIC_GA_TRACKING_ID=your-google-analytics-id

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

## Scripts

```bash
pnpm dev              # Start development server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Lint code with ESLint
pnpm type-check       # Check TypeScript types
pnpm clean            # Clean build artifacts (.next, out)
```

## Adding New Features

### Creating a New Page

```typescript
// src/app/example/page.tsx
import { ExampleComponent } from '@/components/ExampleComponent';

export default function ExamplePage() {
  return (
    <div>
      <h1>Example Page</h1>
      <ExampleComponent />
    </div>
  );
}

// src/app/example/layout.tsx (optional)
export default function ExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="example-layout">
      {children}
    </div>
  );
}
```

### Creating Components

```typescript
// src/components/ExampleComponent.tsx
import { useState } from 'react';
import { ExampleDTO } from '@blindinterview/shared';

interface ExampleComponentProps {
  data: ExampleDTO;
}

export function ExampleComponent({ data }: ExampleComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Component content */}
    </div>
  );
}
```

### Creating Forms

```typescript
// src/components/forms/ExampleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exampleSchema, type ExampleRequest } from '@blindinterview/shared';

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleRequest>({
    resolver: zodResolver(exampleSchema),
  });

  const onSubmit = async (data: ExampleRequest) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Name"
        className="w-full p-2 border rounded"
      />
      {errors.name && (
        <p className="text-red-500">{errors.name.message}</p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### API Integration

```typescript
// src/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
}

// Usage in components
import { ExampleDTO } from '@blindinterview/shared';
import { apiCall } from '@/utils/api';

export function useExample() {
    const [data, setData] = useState<ExampleDTO[]>([]);

    useEffect(() => {
        apiCall<ExampleDTO[]>('/api/examples').then(setData).catch(console.error);
    }, []);

    return data;
}
```

## Styling

We use **Tailwind CSS** for styling. Key concepts:

```typescript
// Utility classes
<div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">

// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">

// Dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

## Component Library

We use **Radix UI** for accessible components:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <Input placeholder="Enter text" />
      </DialogContent>
    </Dialog>
  );
}
```

## Dependencies

This package depends on:

- `@blindinterview/shared` - Shared types and utilities
- External packages defined in `package.json`

## Deployment

### Local Development

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker

```bash
# From root directory - build and run frontend container
pnpm docker:dev:frontend

# Or build and run separately
pnpm docker:build:frontend
pnpm docker:run:frontend

# View logs
pnpm docker:logs:frontend
```

**Docker Environment**: Make sure `apps/frontend/.env` exists before running containers.

**Container URL**: http://localhost:8500

The built application will be in the `.next/` directory.

## Best Practices

1. **Use TypeScript**: Leverage type safety with shared types
2. **Component Composition**: Build reusable, composable components
3. **Server Components**: Use React Server Components when possible
4. **Form Validation**: Always validate forms with Zod schemas
5. **Error Handling**: Implement proper error boundaries
6. **Performance**: Optimize images, use lazy loading
7. **Accessibility**: Follow WCAG guidelines, use semantic HTML

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
