# Premika - Production-Grade Ecommerce Platform

A modern, high-performance, full-stack ecommerce application built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Drizzle ORM.

---

## 🌟 Architecture Overview

Premika enforces a strict 4-layer architecture to ensure clean separation of concerns, scalability, and maintainability:

```
Repositories (Data Access Layer)
       ↓
Services (Business Logic Layer)
       ↓
API Routes / Server Actions (Controller Layer)
       ↓
Frontend Components / Pages (View Layer)
```

### Core Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Database & ORM**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: Vanilla CSS & [Tailwind CSS](https://tailwindcss.com/)
- **State & UI**: Lucide Icons, React Hot Toast, Custom Component Library
- **Validations**: [Zod](https://zod.dev/) schemas for client and server input validation
- **Payments**: Razorpay Payment Gateway Integration
- **Email Service**: Nodemailer (Gmail / SMTP integration)

---

## 📦 Features Summary

### 🛍️ Customer Storefront
- **Home & Catalogue**: High-converting product showcases, responsive grid layouts, category filters, and search.
- **Product Detail**: Multi-image preview, size & height selectors, combo selections, stock status badges, and related items.
- **Cart & Wishlist**: Persistent cart, coupon code application, live subtotal computation, free shipping threshold indicator.
- **Checkout & Payments**: Streamlined guest checkout, Razorpay payment popup, signature verification, invoice generation, and order confirmation email dispatches.
- **Order Tracking**: Public order tracking page supporting Order ID & email lookup.

### ⚙️ Admin Management System
- **Dashboard**: Real-time KPI metrics, revenue charts, recent order feeds, and performance widgets.
- **Product Management**: Full CRUD, variant options, image upload previews, stock status toggles, and bulk operations.
- **Category Organization**: Hierarchical category tree, status toggles, and banner image attachments.
- **Order & Fulfillment**: Status transitions (Pending, Processing, Shipped, Delivered, Cancelled), printable invoices, and email notification re-sends.
- **Customer CRM**: Customer history, lifetime spending metrics, order history, and contact details.
- **Coupon Management**: Percentage & fixed discounts, minimum subtotal requirements, usage limits, duplicate coupon tool, and live cart simulator.
- **Marketing Overview**: Campaign KPIs, top performing coupons, recent promotions, and subscriber analytics.
- **Store Configuration**: Store identity, logo/favicon branding, contact details, business hours, and social media link manager.
- **System Health Diagnostics**: Read-only status report for database connectivity, storage, email transport, payment gateway, build time, and uptime.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or v20.x
- **Package Manager**: `npm` (or `pnpm` / `yarn`)
- **Database**: PostgreSQL 14+ database instance

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/premika-ecommerce.git
cd premika-ecommerce
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your local or staging credentials:

```bash
cp .env.example .env
```

Ensure the following variables are configured:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/premika_db
ADMIN_JWT_SECRET=your_secure_jwt_secret_min_32_characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxx
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### 3. Database Migration & Admin Seeding

Run Drizzle migrations and seed default categories, sample products, and the initial Super Admin account:

```bash
# Push schema to database
npm run db:push

# Seed super admin user (Default Credentials: admin@premika.shop / admin123)
npm run seed:admin

# (Optional) Seed sample products & categories
npm run seed
```

### 4. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Visit the storefront at `http://localhost:3000` and the Admin Portal at `http://localhost:3000/admin`.

---

## 🛠️ Production Build & Deployment

### Build Verification

Before deploying, run type-checking and the production build process:

```bash
# Run TypeScript validation
npx tsc --noEmit

# Execute Next.js production build
npm run build
```

### Deploying to Vercel / Node Server

1. **Environment Variables**: Add all variables from `.env.example` to your deployment environment dashboard.
2. **Database**: Ensure PostgreSQL database URL is accessible from your deployment server with connection pooling enabled.
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`

---

## 🔒 Security & Code Standards

- **Input Validation**: All client and server requests are validated using Zod schemas located in `lib/validations/`.
- **API Error Masking**: 500 Internal Server Errors return clean, generic error messages to client callers without exposing raw database trace details.
- **Admin Route Protection**: Protected via Next.js Middleware and verified in API handlers using JWT session signatures (`ADMIN_COOKIE_NAME`).
- **Database Freeze**: Production schema definitions in `db/schema/` are strictly locked and modified only via formal migrations.

---

## 📄 License

Copyright © 2026 Premika Store. All rights reserved.
