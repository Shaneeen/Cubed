# Cubed

Cubed is a web application for retail shops that rent out cube spaces or shelf spaces to individual merchants. Merchants place products in the physical store, customers browse those products online, and orders are reserved for in-store pickup and payment.

This project is designed around a simple operational model:

- Store owners manage the overall shop and merchant accounts.
- Merchants manage only their own product listings.
- Customers browse products without logging in and submit pickup orders.

The platform is not intended to be a full online payment e-commerce system. Instead, it supports product discovery, reservation, and in-store collection.

## 1. Project Overview

Cubed helps physical retail shops digitize the management of shared retail spaces. Many cube rental stores rely on manual tracking for merchants, inventory, and customer reservations. This system centralizes those operations into one web platform.

Key goals:

- Help store owners manage merchants and products efficiently
- Allow merchants to maintain their own listings
- Let customers browse products online before visiting the store
- Support reservation-based checkout for in-store payment and pickup
- Provide clear order tracking from reservation to collection

## 2. Problem Statement

Retail cube rental shops often face these problems:

- Merchant information is managed manually or across different tools
- Product listings are difficult to keep updated
- Customers cannot easily browse products before visiting the store
- Order reservations are not tracked consistently
- Store owners spend extra time coordinating between merchants and customers

Cubed solves this by providing a shared system where the store owner, merchants, and customers each have a clear workflow and limited access based on their role.

## 3. Target Users

### Store Owners / Super Admins

Store owners run the entire cube rental business and need full visibility across merchants, products, and customer reservations.

### Merchants

Merchants rent cube or shelf spaces inside the store and need a simple way to upload and manage their own products.

### Customers

Customers want to browse available items online, reserve products, and collect them in person from the store.

## 4. User Roles and Permissions

### 1. Store Owner / Super Admin

Permissions:

- Create and manage merchant accounts
- View all merchants
- View all products from all merchants
- Manage product visibility and status
- View all order reservations
- Mark orders as collected or cancelled
- Access overall dashboard and system reports

### 2. Merchant

Permissions:

- Log in to a merchant account
- Create, edit, and delete their own product listings
- View only their own products
- Update stock quantity and product status
- Manage product details such as:
  - Product name
  - Description
  - Price
  - Quantity available
  - Category
  - Image
  - Cube or shelf location
  - Status: `available`, `hidden`, `sold_out`

### 3. Customer

Permissions:

- Browse available products without logging in
- Search and filter products by:
  - Category
  - Merchant
  - Price
  - Keyword
- View product details
- Add products to cart
- Submit a pickup order reservation using:
  - Name
  - Contact number

Customer limitations:

- No account required
- No online payment
- Checkout is only a reservation for in-store pickup and physical payment

## 5. Core Features

- Authentication for Store Owner and Merchant
- Role-based access control
- Merchant account management
- Product listing management
- Product visibility and status control
- Public product catalogue
- Product search and filtering
- Cart system
- Pickup order reservation flow
- Order and reservation tracking
- Super Admin dashboard
- Merchant dashboard
- Responsive design for desktop and mobile

## 6. User Flow

### Main Business Flow

1. Store owner creates a merchant account.
2. Merchant logs in and creates product listings.
3. Customer browses the public catalogue.
4. Customer adds products to cart.
5. Customer submits a pickup order reservation with contact details.
6. Store receives the reservation.
7. Customer visits the store, pays physically, and collects the item.
8. Store owner or admin marks the order as collected.

### User Journey by Role

#### Customer Side

- Visit homepage
- Browse available products
- Filter or search products
- View product details
- Add products to cart
- Submit pickup order reservation

#### Merchant Side

- Log in
- Access merchant dashboard
- Create and manage personal product listings
- Update quantity, location, and status

#### Store Owner Side

- Log in
- Access admin dashboard
- Manage merchants
- View all products
- Review reservations
- Mark orders as collected or cancelled

## 7. System Architecture

Cubed is scaffolded as a Next.js application with Supabase as the backend platform.

### Suggested Tech Stack

- Frontend: Next.js
- Backend: Next.js route handlers and server actions
- Database: Supabase Postgres
- Image Storage: Supabase Storage
- Deployment: Vercel

### High-Level Architecture

```text
Customer / Merchant / Admin
          |
          v
Next.js Web App
          |
          +--> App Router Pages
          +--> Route Handlers / Server Actions
          +--> Authentication & Role Access
          +--> Product and Merchant Management
          +--> Pickup Order Reservation Logic
          |
          v
Supabase
  +--> Postgres Database
  +--> Storage Buckets
  +--> Auth Integration
```

### Recommended Modules

- Public catalogue module
- Authentication module
- Merchant management module
- Product management module
- Cart and reservation module
- Order tracking module
- Dashboard and reporting module

## 8. Suggested Database Schema

The following schema is a practical starting point for development.

### `users`

Stores login credentials and system roles.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| full_name | VARCHAR | User full name |
| email | VARCHAR | Unique login email |
| password_hash | TEXT | Hashed password |
| role | ENUM | `super_admin`, `merchant` |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `merchants`

Stores merchant profile information linked to a user account.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| user_id | UUID / INT | FK to `users.id` |
| business_name | VARCHAR | Merchant or shop name |
| contact_name | VARCHAR | Main contact person |
| phone_number | VARCHAR | Contact number |
| email | VARCHAR | Business email |
| cube_location_notes | TEXT | Optional location notes |
| status | ENUM | `active`, `inactive` |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `categories`

Stores reusable product categories.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| name | VARCHAR | Category name |
| slug | VARCHAR | URL-friendly name |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `products`

Stores products listed by merchants.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| merchant_id | UUID / INT | FK to `merchants.id` |
| category_id | UUID / INT | FK to `categories.id` |
| name | VARCHAR | Product name |
| description | TEXT | Product description |
| price | DECIMAL | Selling price |
| quantity_available | INT | Current stock |
| image_url | TEXT | Product image path or URL |
| cube_location | VARCHAR | Shelf or cube location |
| status | ENUM | `available`, `hidden`, `sold_out` |
| is_visible | BOOLEAN | Public visibility |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `cart_items` or `temporary_cart`

Stores temporary cart items before the customer submits a pickup order. If guest checkout is used, this can be session-based.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| session_id | VARCHAR | Guest cart identifier |
| product_id | UUID / INT | FK to `products.id` |
| quantity | INT | Requested quantity |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `orders`

Stores customer pickup order reservations.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| order_number | VARCHAR | Human-readable reference |
| customer_name | VARCHAR | Customer full name |
| customer_phone | VARCHAR | Contact number |
| status | ENUM | `pending`, `collected`, `cancelled` |
| notes | TEXT | Optional admin notes |
| reserved_at | TIMESTAMP | Reservation time |
| collected_at | TIMESTAMP | Collection completion time |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### `order_items`

Stores the products included in each order.

| Column | Type | Notes |
|---|---|---|
| id | UUID / INT | Primary key |
| order_id | UUID / INT | FK to `orders.id` |
| product_id | UUID / INT | FK to `products.id` |
| merchant_id | UUID / INT | FK to `merchants.id` |
| product_name_snapshot | VARCHAR | Product name at order time |
| price_snapshot | DECIMAL | Price at order time |
| quantity | INT | Reserved quantity |
| created_at | TIMESTAMP | Record creation time |

### Relationship Summary

- One `user` can belong to one merchant account
- One `merchant` can have many `products`
- One `category` can have many `products`
- One `order` can have many `order_items`
- One `product` can appear in many `order_items`

## 9. Team Task Breakdown for 3 Developers

The work split below keeps responsibilities clear and reduces overlap.

### Work Split Table

| Developer | Main Responsibility | Pages / Features |
|---|---|---|
| Dev 1 | Customer-facing frontend | Homepage, product catalogue, product details page, cart page, checkout page, responsive design |
| Dev 2 | Backend + database | Database schema, product APIs, merchant APIs, order APIs, image upload, cart/order logic |
| Dev 3 | Auth + dashboards + integration | Login, role access, super admin dashboard, merchant dashboard, testing, connecting frontend to backend |

### Cleaner Split

#### Developer 1 — Customer UI

- Product browsing page
- Product detail page
- Cart UI
- Checkout form
- Mobile responsive layout

#### Developer 2 — Backend & Database

- Database tables
- Product CRUD
- Merchant CRUD
- Order and order item logic
- API routes
- Image storage setup

#### Developer 3 — Auth, Admin & Integration

- Login system
- Role-based access control
- Super admin dashboard
- Merchant dashboard
- Connect frontend to backend
- Testing and bug fixing

### Responsibility Boundary

- Customer side = public browsing and pickup order reservation
- Merchant side = product management
- Store owner side = merchant management and order control

## 10. Installation Guide

The project uses Next.js with TypeScript and is prepared for Supabase integration.

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- Supabase project

### Basic Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
cd cubed
```

2. Install dependencies:

```bash
npm install
```

3. Create an environment file:

```bash
cp .env.example .env.local
```

4. Configure the Supabase environment variables.

5. Create your Supabase tables and storage bucket.

6. Start the development server:

```bash
npm run dev
```

### Suggested Initial Setup Tasks

- Create Supabase tables
- Seed categories
- Create a super admin account
- Configure Supabase Storage for product images
- Test product creation and reservation flow

## 11. Environment Variables

Below is the current environment variable list for the Next.js + Supabase starter.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Notes

- `NEXT_PUBLIC_` variables are safe for client-side Supabase usage.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used on the server.
- Keep all secrets out of source control.

## 12. Folder Structure

This is a suggested structure for a clean and maintainable codebase.

```text
cubed/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── merchant/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── layouts/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── merchants/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── admin/
│   │   ├── customer/
│   │   └── merchant/
│   ├── services/
│   ├── lib/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── .env.local
├── next.config.mjs
├── next-env.d.ts
├── package.json
└── README.md
```

## 13. Future Improvements

- Low stock alerts for merchants and admins
- Merchant sales summary and analytics
- Admin reporting dashboard
- QR code for order pickup reference
- Product reservation expiry handling
- Multiple store branches
- Better product image gallery support
- Customer order confirmation via SMS or WhatsApp
- Audit logs for admin actions
- Barcode or SKU support

## 14. License

This project can be released under the MIT License unless your team or organization chooses a different license.

```text
MIT License
```

If needed, add a separate `LICENSE` file to the repository.

## 15. Project Structure

This section explains what each folder and important file is for, and what should go inside it.

```text
cubed/
├── README.md
├── package.json
├── next.config.mjs
├── next-env.d.ts
├── tsconfig.json
├── .env.example
├── .env.local
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/page.tsx
│   │   ├── merchant/page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── layouts/
│   ├── features/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── types/
└── supabase/
    ├── migrations/
    └── seed.sql
```

### Root Files

- `README.md`: main project overview and team guidance
- `package.json`: dependencies, scripts, and project metadata
- `next.config.mjs`: Next.js configuration
- `next-env.d.ts`: Next.js TypeScript support file
- `tsconfig.json`: TypeScript configuration and path aliases
- `.env.example`: sample environment variables for new developers
- `.env.local`: local secrets and Supabase keys, not committed

### `src/app/`

This is the Next.js App Router area. It contains the actual route files and global app layout.

- `layout.tsx`: shared app shell, metadata, theme provider, and global layout wrapper
- `page.tsx`: customer-facing homepage and entry point
- `admin/page.tsx`: store owner dashboard entry page
- `merchant/page.tsx`: merchant dashboard entry page
- `globals.css`: app-wide theme tokens, layout styles, and shared component styles

What should go here:

- Page routes
- Route layouts
- Global styling
- Shared app wrappers

### `src/components/`

Reusable UI components that can be used across pages and features.

Current files:

- `theme/ThemeProvider.tsx`: applies the active theme to the app
- `theme/ThemeToggle.tsx`: light and dark mode switch
- `theme/ThemeSwatches.tsx`: palette preview component
- `dashboard/DashboardPlaceholder.tsx`: reusable placeholder for dashboard routes

What should go here:

- Buttons
- Cards
- Modals
- Tables
- Shared UI elements that are not tied to one feature only

### `src/layouts/`

Layout wrappers for sections of the app.

Current file:

- `AppShell.tsx`: top navigation, role links, and shared page container

What should go here:

- App shell layouts
- Sidebar layouts
- Header and footer wrappers
- Shared page structure components

### `src/features/`

Feature-based folders for business logic and UI grouped by domain.

Current folders:

- `auth/`: login, sessions, protected route helpers
- `products/`: product forms, queries, validation, and product UI logic
- `cart/`: cart state and reservation flow logic
- `orders/`: pickup order logic and admin order actions
- `customer/`: customer-facing feature notes and modules
- `merchant/`: merchant-facing feature notes and modules
- `merchants/`: merchant CRUD and merchant data handling
- `admin/`: store owner feature notes and admin modules

What should go here:

- Feature-specific components
- Feature-specific hooks
- Feature-specific utilities
- Business rules tied to one domain

### `src/lib/`

Shared low-level helpers used by multiple parts of the app.

Current files:

- `supabase/client.ts`: browser Supabase client
- `supabase/server.ts`: server-side Supabase client

What should go here:

- API clients
- Shared utility functions
- Database helpers
- Auth helpers

### `src/pages/`

This folder is used for page documentation and planning notes, not for active Next.js routes in this setup.

Current file:

- `README.md`: page ownership and route guidance for the team

What should go here:

- Page planning notes
- Route ownership breakdowns
- Handoff checklists

### `src/services/`

Shared service-level documentation and future service helpers.

Current file:

- `README.md`: placeholder guidance for service layer usage

What should go here:

- HTTP services
- API wrappers
- Data-fetching services

### `src/styles/`

Style system notes and design guidance for the team.

Current file:

- `README.md`: color system, typography rules, dark mode rules, and layout guidance

What should go here:

- Styling documentation
- Design tokens
- Layout rules
- Theme guidance

### `src/types/`

Shared TypeScript types and interfaces.

Current file:

- `README.md`: placeholder guidance for shared type definitions

What should go here:

- Database row types
- API response types
- Component prop types
- Shared enums and interfaces

### `supabase/`

Database and seed setup for Supabase.

Current files:

- `migrations/`: SQL migration files for table creation and changes
- `seed.sql`: starter seed data, such as categories

What should go here:

- SQL migrations
- Seed scripts
- Row-level security policies
- Table and storage setup scripts
