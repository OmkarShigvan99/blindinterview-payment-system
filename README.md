# BlindInterview - Payment & User Management System

> A full-stack web application built to manage user authentication, credits/plans purchase, and payment processing for the BlindInterview desktop application. This project has been discontinued, but it demonstrates the journey of building a production system from the ground up.

---

## 📋 Project Summary

**BlindInterview** is a production-ready payment and user management platform that demonstrates full-stack development expertise. Built with Next.js, Express.js, and MongoDB, this system handles complete user lifecycle management—from secure authentication through multi-currency payment processing to transaction management.

**Key accomplishments:**

- 🔐 Implemented dual-gateway payment integration (Razorpay & Cashfree) with webhook verification and abandoned order recovery
- 🌍 Built location-based dynamic pricing with real-time currency conversion for global users
- 📧 Designed transactional email system with verification workflows and payment receipts
- 🚀 Deployed serverless infrastructure on Google Cloud Platform with CI/CD automation
- 📊 Created scalable monorepo architecture with TypeScript type safety across all packages

**Real-world impact:** Handles complex payment workflows with proper error handling, security considerations, and production reliability. Demonstrates understanding of complete development lifecycle from architecture to deployment.

---

## 💼 Skills Demonstrated

### **Backend Development**

- Node.js & Express.js
- RESTful API Design
- MongoDB Document Design
- JWT Authentication
- Webhook Integration & Signature Verification
- Email Service Integration
- Redis Caching
- Error Handling & Logging

### **Frontend Development**

- Next.js 15 (App Router)
- React 19 (Hooks, Server Components)
- TypeScript
- Tailwind CSS
- Form Validation & Error States
- State Management
- Responsive Design

### **Payment Integration**

- Razorpay API Integration
- Cashfree API Integration
- Dual-Gateway Redundancy
- Payment Verification Flows
- Order Management
- Currency Conversion
- Abandoned Order Recovery

### **DevOps & Cloud Infrastructure**

- Docker & Multi-Stage Builds
- Google Cloud Platform (GCP)
- Cloud Run (Serverless)
- Cloud Build (CI/CD)
- Load Balancer Configuration
- DNS Management (Hostinger)
- SSL/HTTPS Setup
- Environment Configuration

### **Architecture & Design**

- Monorepo Structure (Turborepo)
- Separation of Concerns
- Scalable System Design
- Database Schema Design
- API Rate Limiting
- Security Best Practices
- Type-Safe Shared Packages (Zod Schemas)

### **Security & Best Practices**

- Password Hashing (bcrypt)
- Input Validation
- CORS Protection
- Environment Variables Management
- Webhook Signature Verification
- Email Authentication (DKIM/SPF)
- Secure Password Reset Flows
- SQL Injection Prevention

### **Tools & Technologies**

- TypeScript
- pnpm (Package Manager)
- Turborepo
- Docker
- Git & GitHub
- Linux/Bash
- REST APIs
- MongoDB

---

## 🎯 The Story Behind This Project

I built this as the web gateway for the BlindInterview desktop application. The goal was to create a platform where users could authenticate, purchase interview preparation credits and subscription plans, and manage their accounts.

What made it interesting was handling payments thoughtfully. Users are everywhere—different countries, different payment methods, different circumstances. Some might start a payment and get interrupted. I wanted to build something that gracefully handled all of that.

It started as a payment processing system and evolved into a complete user management platform with email verification, password reset flows, and the ability to return to incomplete orders—all while keeping security and reliability in mind.

---

## 💭 Why This Experience Mattered

Building a payment system taught me things that go beyond typical CRUD applications. It's not just about moving data around; it's about handling edge cases, security considerations, and real-world complexity that doesn't always appear in tutorials.

**Some things I learned:**

- How payment gateways actually work (it's more nuanced than documentation suggests)
- The importance of thinking through "what if" scenarios
- DevOps isn't as mysterious as it seems once you sit down and learn it
- Type safety across a monorepo actually prevents a lot of mistakes
- Production is different from development in ways you only discover by shipping

---

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI Components
- **State Management**: React Hooks
- **HTTP Client**: Modern Fetch API

### **Backend**

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB (document storage)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateways**: Razorpay API & Cashfree API
- **Caching**: Redis (for session management & rate limiting)

### **Infrastructure & DevOps**

- **Monorepo**: Turborepo + pnpm
- **Containerization**: Docker (multi-stage builds)
- **Cloud Platform**: Google Cloud Platform (GCP)
- **CI/CD**: Cloud Build (automated testing & deployment)
- **Deployment**: Cloud Run (serverless containers)
- **Load Balancer**: Traffic routing & distribution
- **DNS Configuration**: Hostinger domain mapping & DNS records
- **Domain Management**: Custom domain with SSL/HTTPS
- **Email Service**: Transactional email integration
- **Package Manager**: pnpm (faster, more efficient than npm)

### **Shared Packages**

- **Type Safety**: Shared TypeScript interfaces
- **Validation**: Zod schemas (runtime type checking)
- **Utilities**: Currency conversion, country detection, enum helpers

---

## 🎯 Core Features

### 1. **User Authentication**

- Secure login/signup with JWT tokens
- Email validation and password hashing
- Session management with refresh tokens
- Role-based access control

### 2. **Order & Payment Management**

- **Order Creation**: Users select plans/credits and initiate purchases
- **Dual Gateway Support**:
  - Razorpay checkout integration
  - Cashfree payment integration
- **Real-time Payment Verification**:
  - Client-side order validation
  - Server-side payment verification via webhook
  - Atomic transaction handling

### **3. Dynamic Pricing**

- **Location-Based Pricing**: Automatically detects user location
- **Multi-Currency Support**: Displays prices in user's local currency
- **Automatic Conversion**: Real-time exchange rate updates
- **Tier Management**: Multiple subscription tiers with different benefits

### **4. Email System**

- **Email Verification**: Send verification emails for user signup
- **Password Reset**: Secure password change with email confirmation
- **Payment Notifications**: Order confirmation and payment success emails
- **Receipt Generation**: Email-based payment receipts to users
- **Transactional Emails**: Automated notifications for account activities

### **5. Retry Payment Capability**

- **Abandoned Order Recovery**: Users can complete payment on incomplete orders anytime
- **Persistent Order Storage**: Orders remain in database even if payment isn't completed
- **One-Click Retry**: Resume checkout from dashboard or email link
- **No Duplicate Orders**: System prevents creating duplicate orders for same purchase
- **Retry Link in Emails**: Convenient access to complete payment from email notifications

### **6. Dashboard & Transactions**

- **User Dashboard**: View purchase history and account details
- **Transaction Management**: Track all orders with status (pending, completed, failed)
- **API Keys Management**: For desktop app integration
- **Credits Tracking**: Real-time credit balance
- **Payment Retry**: Resume incomplete payments anytime

### **5. Webhook Integration**

- Razorpay webhook handlers for payment confirmation
- Cashfree webhook handlers for transaction updates
- Automatic order status synchronization
- Error handling and retry mechanisms

```
blindinterview/
├── apps/
│   ├── backend/                    # Express.js API Server
│   │   ├── src/
│   │   │   ├── controller/         # Request handlers
│   │   │   ├── service/            # Business logic & payment processing
│   │   │   ├── model/              # MongoDB schemas
│   │   │   ├── route/              # API endpoints
│   │   │   ├── middleware/         # Auth, logging, error handling
│   │   │   ├── database/           # DB connection & Redis
│   │   │   └── config/             # Environment & strategy configs
│   │   └── Dockerfile             # Container definition
│   │
│   └── frontend/                   # Next.js Web Application
│       ├── src/
│       │   ├── app/               # Next.js app router pages
│       │   ├── components/        # Reusable React components
│       │   ├── lib/               # Utilities & server functions
│       │   └── hooks/             # Custom React hooks
│       └── Dockerfile             # Container definition
│
├── packages/
│   └── shared/                     # Shared Code
│       ├── schemas/               # Zod validation schemas
│       ├── types/                 # TypeScript interfaces
│       ├── constants/             # Brand & global constants
│       └── utils/                 # Helper functions
│
├── cloudbuild.yaml               # GCP Cloud Build configuration
├── docker-compose.yml            # Local development orchestration
├── turbo.json                    # Turborepo configuration
├── pnpm-workspace.yaml           # pnpm workspace definition
└── package.json                  # Root workspace scripts
```

---

## 🔄 Payment Flow Architecture

### **Order Creation to Payment Verification**

```
┌─────────────────────────────────────────────────────────────┐
│                    1. ORDER INITIATION                        │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend                          Backend                     │
│  ┌──────────────┐                ┌──────────────┐            │
│  │ User selects │                │ Validate    │            │
│  │ plan/credits ├────────────────► order data   │            │
│  │              │                │ Create order │            │
│  │              │ ◄────────────── │ in MongoDB   │            │
│  │ Receives:    │                └──────────────┘            │
│  │ - Order ID   │                                             │
│  │ - Amount     │                                             │
│  │ - Currency   │                                             │
│  │ - Retry link │  ◄─── Persisted for later payment         │
│  └──────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               2. PAYMENT GATEWAY CHECKOUT                     │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend                  Payment Gateway                    │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Call payment │         │ Razorpay or  │                  │
│  │ API with     ├────────►│ Cashfree     │                  │
│  │ order details│         │ checkout page│                  │
│  │              │         └──────────────┘                  │
│  │ User enters  │              │                             │
│  │ payment info │◄─────────────┘                             │
│  │ & confirms   │                                             │
│  │              │                                             │
│  │ (Optional)   │    ◄─── User can navigate away,            │
│  │ Navigate     │         complete payment later             │
│  │ away/close   │                                             │
│  └──────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│     3A. RETRY PAYMENT (User Returns to Incomplete Order)    │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  Dashboard/Email Link                                         │
│  ┌──────────────────────────────────────┐                    │
│  │ User clicks "Complete Payment"       │                    │
│  │ System retrieves order from DB       │                    │
│  │ Reinitiate checkout with same order  │                    │
│  │ No duplicate order created           │                    │
│  └──────────────────────────────────────┘                    │
│           │                                                    │
│           ▼ (Continue to step 3B)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│          3B. PAYMENT VERIFICATION (Dual Layer)               │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Client-side Verification                           │
│  ┌────────────────────────────────────────────────┐          │
│  │ Frontend receives payment response              │          │
│  │ Validates signature & order details            │          │
│  │ Shows success/failure to user                  │          │
│  └────────────────────────────────────────────────┘          │
│                         │                                      │
│                         ▼                                      │
│  Layer 2: Webhook Verification (Authoritative)               │
│  ┌────────────────────────────────────────────────┐          │
│  │ Payment Gateway sends webhook to backend       │          │
│  │ Backend verifies signature & payment status    │          │
│  │ Updates order in MongoDB & adds credits       │          │
│  │ Sends confirmation back to gateway            │          │
│  │ Sends success email to user                   │          │
│  └────────────────────────────────────────────────┘          │
│                         │                                      │
│                         ▼                                      │
│  ┌────────────────────────────────────────────────┐          │
│  │ Database Updated:                              │          │
│  │ - Order status: "completed"                    │          │
│  │ - User credits increased                       │          │
│  │ - Transaction logged                           │          │
│  │ - Payment timestamp recorded                   │          │
│  └────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Pipeline

### **Production Infrastructure Architecture**

```
┌─────────────────────────────────────────────────────────┐
│              DOMAIN & LOAD BALANCING                     │
│  (Hostinger DNS + Custom Domain Configuration)          │
│                                                           │
│  blindinterview.com ──┐                                  │
│                       ├──► Load Balancer (Traffic Router)│
│  *.blindinterview.com─┘                                  │
│           │                                               │
│           ▼                                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Load Balancer                                   │    │
│  │  - Route traffic to appropriate services         │    │
│  │  - SSL/HTTPS termination                        │    │
│  │  - Request forwarding (Frontend/Backend)        │    │
│  │  - Health checks                                │    │
│  └─────────────────────────────────────────────────┘    │
│           │                      │                       │
│           ▼                      ▼                       │
│    ┌─────────────┐        ┌─────────────┐             │
│    │  Frontend   │        │   Backend   │             │
│    │ Cloud Run   │        │  Cloud Run  │             │
│    │  (GCP)      │        │   (GCP)     │             │
│    └─────────────┘        └─────────────┘             │
│           │                      │                       │
│           └──────────┬───────────┘                       │
│                      ▼                                   │
│          ┌──────────────────────┐                       │
│          │ Shared Services      │                       │
│          │ - MongoDB Database   │                       │
│          │ - Redis Cache        │                       │
│          │ - Email Service      │                       │
│          └──────────────────────┘                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### **DNS Configuration & Domain Setup**

```
DNS Records (Hostinger Configuration):
┌────────────────────────────────────────────┐
│ A Record                                    │
│ Domain: blindinterview.com                  │
│ Points to: Load Balancer IP                │
│                                             │
│ CNAME Records                              │
│ www → blindinterview.com                    │
│ api → Load Balancer IP                      │
│ dashboard → Load Balancer IP                │
│                                             │
│ MX Records                                 │
│ For email verification & notifications     │
│                                             │
│ TXT Records (DKIM/SPF)                     │
│ For email authentication                    │
└────────────────────────────────────────────┘
```

### **CI/CD with Google Cloud Platform**

```
Git Commit
    │
    ▼
┌──────────────────┐
│  Cloud Build     │  ◄─── Triggered automatically
│  - Lint code     │
│  - Run tests     │
│  - Type-check    │
└──────────────────┘
    │
    ▼ (if successful)
┌──────────────────┐
│  Docker Build    │  ◄─── Multi-stage build
│  - Frontend img  │       - Reduced image size
│  - Backend img   │       - Optimized layers
│  - Push to GCR   │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│  Cloud Run       │  ◄─── Serverless deployment
│  - Auto-scale    │       - Cost-efficient
│  - Health checks │       - Zero cold-start
│  - Environment   │
│    vars set      │
└──────────────────┘
    │
    ▼
✅ Deployment Complete
```

### **Containerization Strategy**

**Multi-stage Docker builds reduce image size by ~70%**

```dockerfile
# Frontend Dockerfile Example
FROM node:18 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
```

---

## 📱 Key Pages & Features

### **Frontend Pages**

- **Homepage**: Landing page with feature highlights & pricing
- **Login/Signup**: User authentication with form validation & email verification
- **Email Verification**: Email confirmation flow after signup
- **Forgot Password**: Password reset request with secure email link
- **Reset Password**: Secure password change from email link
- **Pricing Page**: Dynamic pricing based on user location with currency conversion
- **Payment Checkout**: Razorpay/Cashfree integration with retry capability
- **Dashboard**: Transaction history, account management, and pending order recovery
- **Order Success Page**: Confirmation with order details & email receipt

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Password Hashing** - Industry-standard bcrypt hashing  
✅ **Email Verification** - Verified email addresses prevent fraud
✅ **CORS Protection** - Controlled cross-origin requests  
✅ **Environment Variables** - Sensitive data not in code  
✅ **Webhook Signature Verification** - Validates payment gateway webhooks  
✅ **Rate Limiting** - Redis-based request throttling  
✅ **Input Validation** - Zod schemas prevent injection attacks  
✅ **HTTPS Only** - Encrypted data in transit with SSL/TLS
✅ **Email Authentication** - SPF/DKIM records for secure emails

### **CI/CD Validation**

- Automated linting on each commit
- Type-checking before deployment
- Docker image security scanning
- Environment variable validation

---

## 🎓 Learning Outcomes & Skills Demonstrated

### **Full-Stack Development**

- ✅ Modern React patterns (hooks, server components)
- ✅ Next.js 15 with App Router
- ✅ Express.js middleware & route handling
- ✅ MongoDB document design & queries
- ✅ Email service integration (NodeMailer, SendGrid, etc.)
- ✅ Password reset flows with secure tokens

### **Payment Processing**

- ✅ Multi-gateway payment integration (Razorpay & Cashfree)
- ✅ Webhook handling & signature verification
- ✅ Currency conversion & exchange rates
- ✅ Order state management
- ✅ Incomplete order recovery & retry mechanisms
- ✅ Transactional consistency across payment systems

### **DevOps & Cloud**

- ✅ Docker containerization & multi-stage builds
- ✅ Google Cloud Platform (Cloud Run, Cloud Build)
- ✅ CI/CD pipeline automation
- ✅ Environment configuration management
- ✅ Load balancer configuration & traffic routing
- ✅ DNS management with Hostinger
- ✅ Custom domain deployment & SSL/HTTPS setup
- ✅ Email service integration for transactional emails
- ✅ Production infrastructure design

### **Email & Communication**

- ✅ Transactional email templates
- ✅ Email verification workflows
- ✅ Password reset email flows
- ✅ Payment confirmation & receipt emails
- ✅ DKIM/SPF configuration for email authentication

### **Architecture & Design**

- ✅ Monorepo structure with Turborepo
- ✅ Shared type safety across packages
- ✅ Scalable API design
- ✅ Separation of concerns
- ✅ Abandoned order recovery patterns
- ✅ Resilient payment processing

### **Security & Best Practices**

- ✅ JWT authentication flow
- ✅ Password hashing & salting
- ✅ Email-based identity verification
- ✅ Input validation with Zod
- ✅ Webhook signature verification
- ✅ Environment-based configuration
- ✅ Secure password reset mechanisms

---

## 📸 Screenshots & Demo

> **Screenshots showcase the complete user experience and infrastructure**. Place high-resolution screenshots in the `./screenshots/` folder with the naming convention below for proper display.

### Authentication & Account Flow

#### 🔐 Login Interface

![Login page](./screenshots/login.png)
_Secure login page with email and password fields, form validation, and password recovery link_

#### 📝 Sign Up / Registration

![Signup page](./screenshots/signup.png)
_User registration form with email verification setup and account creation_

#### 📧 Verification Email Template

![Email verification template](./screenshots/verification-email.png)
_Professional email sent to users for email confirmation during registration_

#### ✅ Verification Sent Confirmation

![Verification sent page](./screenshots/verification-sent.png)
_Confirmation page indicating verification email has been dispatched successfully_

#### ✔️ Email Verification Complete

![Verification completed](./screenshots/verification-done.png)
_Success page confirming email address has been verified and account is active_

---

### Payment Gateway Integration & Checkout Flow

#### 🔄 Payment Flow Diagram - Step 1

![Payment flow initiation](./screenshots/payment-flow-1.png)
_First stage showing order creation and gateway selection process_

#### 🔄 Payment Flow Diagram - Step 2

![Payment flow verification](./screenshots/payment-flow-2.png)
_Second stage with user entering payment details in gateway interface_

#### 🔄 Payment Flow Diagram - Step 3

![Payment flow completion](./screenshots/payment-flow-3.png)
_Final stage showing webhook verification and order completion_

#### 💳 Razorpay Gateway - First Interface

![Razorpay checkout page 1](./screenshots/razorpay-gateway-1.png)
_Razorpay payment gateway first step with order summary and payment method selection_

#### 🛒 Razorpay Gateway - Second Step

![Razorpay checkout page 2](./screenshots/razorpay-gateway-2.png)
_Razorpay payment completion interface with card/UPI entry and confirmation_

#### 💰 Razorpay Transaction Records

![Razorpay transaction history](./screenshots/razorpay-transactions.png)
_Backend view of processed Razorpay transactions with payment IDs and statuses_

#### 💳 Cashfree Alternative Gateway

![Cashfree payment gateway](./screenshots/cashfree-gateway.png)
_Cashfree payment checkout interface demonstrating dual-gateway redundancy option_

#### 📊 Cashfree Transaction Records

![Cashfree transaction history](./screenshots/cashfree-transactions.png)
_Cashfree processed transactions showing payment verification and order confirmations_

#### ✅ Payment Success Confirmation

![Success page after payment](./screenshots/payment-success.png)
_Order confirmation page with transaction ID, credits added notification, and dashboard access_

#### 🔒 Payment Verification Backend

![Payment verification logs](./screenshots/payment-verification.png)
_Frontend showing dual-layer payment verification process_

#### 📧 Purchase Confirmation Email

![Purchase notification email](./screenshots/purchase-notification-email.png)
_Transactional email receipt with order details and account dashboard link_

---

### User Dashboard & Account Management

#### 📊 Main Dashboard

![User dashboard overview](./screenshots/dashboard.png)
_Main dashboard showing user profile, credits balance, payment history, and quick action menu_

#### 📋 Order History View

![Order history page](./screenshots/order-history.png)
_Complete transaction list with date, amount, currency, status, and plan information_

#### ⏳ Pending Payment Status

![Pending order awaiting payment](./screenshots/pending-payment.png)
_Incomplete order display with one-click "Complete Payment" button for abandoned orders_

#### 💳 Cashfree Payment History

![Cashfree transaction history in dashboard](./screenshots/cashfree-payment-history.png)
_User's transaction history showing all Cashfree gateway purchases and statuses_

---

### Database & Backend Infrastructure

#### 🗄️ MongoDB Orders Collection

![MongoDB database structure](./screenshots/mongodb-transactions.png)
_MongoDB orders collection showing document schema, payment statuses, and gateway details_

## 🔗 Project Links

- **Repository**: [github.com/Omishigvan99/blindinterview](https://github.com/Omishigvan99/blindinterview)
- **Current Branch**: `dev`
- **Status**: Archived (Proof of Concept)

---

## 🎯 What Makes This Project Impressive

1. **Production-Ready Architecture** - Monorepo with clear separation of concerns
2. **Real-World Complexity** - Multi-gateway payment processing with webhook handling
3. **Cloud-Native** - Full containerization and serverless deployment on GCP
4. **Type-Safe** - End-to-end TypeScript with shared interfaces
5. **Scalable Design** - Can handle growing user base with minimal changes
6. **Automated Deployment** - CI/CD pipeline ensures consistent quality

---

## 📝 License

ISC License - See LICENSE file for details

---

**Built with ❤️ to showcase modern full-stack development practices**

_Last Updated: November 2025_
