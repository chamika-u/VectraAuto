# VectraAuto

Digital Innovation E-Commerce Platform for Automotive Parts & Accessories.

VectraAuto is a modern, high-performance automotive parts e-commerce storefront built with Next.js App Router (Next.js 15), React 19, TypeScript, and Tailwind CSS. It features an interactive Year-Make-Model (YMM) vehicle fitment finder, real-time inventory management, persistent cart management, simulated checkout with Cash on Delivery & Card support, an administrative dashboard, and serverless-compatible JSON-backed atomic storage.

---

## Table of Contents

- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Seed the Runtime Database](#3-seed-the-runtime-database)
  - [4. Start the Development Server](#4-start-the-development-server)
- [Production & Vercel Deployment](#production--vercel-deployment)
- [Storefront Architecture & Design](#storefront-architecture--design)
- [Admin Control Panel](#admin-control-panel)
- [Demo Card Information](#demo-card-information)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Troubleshooting](#troubleshooting)

---

## Key Features

- **🚗 Precision Vehicle Fitment Finder**: Filter parts by Year, Make, Model, and Engine variant with real-time compatibility indicators (`compatible`, `incompatible`, `unknown`).
- **🖼️ Rotating Automotive Hero Slider**: Smooth crossfading high-resolution showcase backgrounds with directional contrast overlays designed for visual depth and readability.
- **🔍 Catalog & Instant Search**: Real-time keyword search across titles, descriptions, categories, SKUs, and manufacturer part numbers.
- **🛒 Persistent Cart & Inventory Validation**: Client-side persisted shopping cart with automated inventory validation and stock conflict resolution.
- **💳 Simulated Checkout & Payment Options**: Streamlined multi-step checkout with delivery calculations, order summaries, sandbox credit card simulation, and Cash on Delivery (COD).
- **📋 Order Receipt & Tracking**: Immediate order confirmation and tracking lookup via unique order references, with serverless client-side fallback storage.
- **📊 Admin Control Panel (`/admin`)**: Dedicated management portal for real-time sales overview metrics, fulfillment status workflows, atomic stock adjustments, and vehicle fitment lookup.
- **⚡ Serverless-Ready JSON Storage**: Zero-external-database architecture with file locking and atomic in-memory fallback for read-only serverless environments (e.g. Vercel Lambda).

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js**: `v20.x` LTS or `v22.x` (tested on Node v20+ and v22+)
- **npm**: `v10.x` or newer
- **Operating System**: Windows, macOS, or Linux

Verify your versions:
```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone and Install Dependencies

Navigate to your workspace directory and install the required npm dependencies:

```bash
cd VectraAuto
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration into a local environment file (`.env.local` or `.env`):

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**On macOS / Linux (Bash):**
```bash
cp .env.example .env.local
```

#### Environment Variables Reference

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VECTRA_DATA_DIR` | Directory containing runtime JSON storage files | `./data` |
| `VECTRA_DELIVERY_FEE_CENTS` | Delivery fee in cents (e.g., 50000 = LKR 500.00) | `50000` |
| `VECTRA_RETENTION_DAYS` | Number of days to retain completed/cancelled orders | `30` |
| `NODE_ENV` | Application environment (`development`, `production`, `test`) | `development` |

### 3. Seed the Runtime Database

Initialize the runtime data store (`data/runtime.store.json`) from the seed catalog (`data/catalog.seed.json`):

```bash
npm run seed
```

> [!TIP]
> If you ever need to reset orders, stock levels, and inventory back to the pristine catalog state, run:
> ```bash
> npm run seed -- --reset
> ```

### 4. Start the Development Server

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

The application is now running locally in development mode with hot-reloading enabled.

---

## Production & Vercel Deployment

### Local Production Build

To create an optimized production build and run the production server locally:

```bash
# 1. Build the production package
npm run build

# 2. Start the production server
npm run start
```

### Deploying to Vercel

VectraAuto is optimized for one-click deployment on **Vercel**:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the Vercel dashboard, click **"Add New Project"** and import the repository.
3. Keep the default Next.js build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `VectraAuto` (or `./` if at the repo root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Deploy!

> [!NOTE]
> The application includes serverless-resilient fallback mechanisms for read-only lambda filesystems (`EROFS`) and bundles the catalog seed directly into production traces, ensuring zero runtime configuration errors.

---

## Storefront Architecture & Design

- **Navigation Header**: Frosted glass sticky header with active route indicators and quick links to `About Us`, `All Parts`, `Privacy Policy`, `Terms & Conditions`, and `Contact Us`.
- **Fitment Filter**: Precision vehicle selector styled with automotive performance red two-tone gradient accents, Lucide icons, and active vehicle persistence.
- **Product Cards**: Uniform height cards with clamping for clean horizontal alignment and consumer-friendly stock badges.
- **Product Detail**: High-resolution image gallery, structured specifications table, vehicle compatibility listing, and instant Add to Cart action.
- **Contact & Support**: Clean customer service desk with direct hotline, business address in Colombo, operating hours, and inquiry submission.

---

## Admin Control Panel

Access the administrator portal directly at `http://localhost:3000/admin` (or click **View Storefront** to toggle back).

### Modules:
- **📊 Overview Dashboard (`/admin`)**: Real-time sales metrics (Total Gross Revenue in LKR, Orders count, Low Stock count, Active SKUs), recent customer orders list, and low-stock inventory alerts.
- **📦 Orders Management (`/admin/orders`)**: Filter by status (`confirmed`, `processing`, `dispatched`, `delivered`, `cancelled`) or payment method, search by reference / customer name / phone, and open the full order inspector drawer to review customer details, destination address, vehicle snapshot, itemized parts, and update fulfillment state.
- **🏷️ Products & Inventory (`/admin/products`)**: Real-time inventory table with one-click atomic stock increments/decrements (+ / -), direct stock input, category and stock level filters, and product editing modal (modify price in LKR, stock count, featured badge, and active/inactive status).
- **🚗 Vehicles & Fitment (`/admin/vehicles`)**: Vehicle compatibility catalog with search by Year, Make, Model and mapped compatible part counts.

---

## Demo Card Information

The checkout uses a sandbox simulation. No actual credit card transactions are processed. Use the following test card values during checkout:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: Any future date (e.g. `12/28`)
- **CVC**: Any 3 or 4 digits (e.g. `123`)
- **Cardholder Name**: Any name (e.g. `Demo User`)

---

## Available Scripts

The following commands are defined in `package.json`:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `build` | `npm run build` | Compiles the TypeScript and Next.js app for production |
| `start` | `npm run start` | Runs the compiled production build |
| `seed` | `npm run seed` | Seeds or validates the runtime catalog store |
| `seed -- --reset` | `npm run seed -- --reset` | Resets runtime data (inventory, orders) to seed defaults |
| `purge:orders` | `npm run purge:orders` | Purges/anonymizes orders older than the retention threshold |
| `lint` | `npm run lint` | Runs ESLint to check code quality and formatting rules |
| `typecheck` | `npm run typecheck` | Runs the TypeScript compiler (`tsc`) to verify type safety |
| `test` | `npm run test` | Runs unit and integration test suites using Vitest |
| `test:watch` | `npm run test:watch` | Runs Vitest in interactive watch mode |
| `test:e2e` | `npm run test:e2e` | Runs end-to-end browser tests using Playwright |
| `test:a11y` | `npm run test:a11y` | Runs automated accessibility audits with Axe & Playwright |

---

## Project Architecture

```
VectraAuto/
├── data/                    # JSON data stores & catalog seed files
│   ├── catalog.seed.json    # Read-only catalog seed (vehicles, products, fitments)
│   └── runtime.store.json   # Mutable runtime data store (created on seed)
├── public/                  # Static assets (images, icons, hero sliders, product media)
├── scripts/                 # Maintenance, seeding, and retention scripts
├── src/
│   ├── app/                 # Next.js App Router pages and API route handlers
│   │   ├── admin/           # Admin portal (Overview, Orders, Products, Vehicles)
│   │   ├── cart/            # Cart page and drawer
│   │   ├── checkout/        # Multi-step checkout flow
│   │   ├── orders/          # Order receipt & confirmation views
│   │   ├── products/        # Catalog listing and single product detail
│   │   └── ...              # Informational pages (About, Contact, Privacy, Terms)
│   ├── components/          # React UI components (Cart, Catalog, Fitment, Layout, Home)
│   ├── lib/                 # Shared utilities, currency formatters (LKR), and contracts
│   ├── server/              # Server-side business logic, repository, and JSON storage
│   └── styles/              # Global CSS, theme variables, and Tailwind styling
├── next.config.ts           # Next.js build configuration & file tracing
├── package.json             # NPM dependencies and project scripts
├── tsconfig.json            # TypeScript configuration
└── vitest.config.ts         # Vitest unit & integration test configuration
```

---

## Troubleshooting

### Store file not initialized (`runtime.store.json`)
If you receive an error indicating that the runtime data store cannot be found or is uninitialized, run:
```bash
npm run seed
```

### Port 3000 is already in use
If another process is using port `3000`, run Next.js on an alternate port:
```bash
npm run dev -- -p 3001
```

### Resetting test data & stock quantities
To clean up test orders and restore all product inventory back to original quantities:
```bash
npm run seed -- --reset
```
