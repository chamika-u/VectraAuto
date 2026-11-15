# VectraAuto

Digital Innovation E-Commerce Platform for Automotive Parts & Accessories.

VectraAuto is a modern, high-performance automotive parts e-commerce storefront built with Next.js App Router, React 19, TypeScript, and Tailwind CSS. It features an interactive Year-Make-Model (YMM) vehicle fitment finder, real-time inventory tracking, persistent cart management, simulated checkout, and JSON-backed atomic storage.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Seed the Runtime Database](#3-seed-the-runtime-database)
  - [4. Start the Development Server](#4-start-the-development-server)
- [Production Deployment](#production-deployment)
- [Demo Card Information](#demo-card-information)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Vehicle Fitment Finder**: Filter products by Year, Make, and Model with live compatibility indicators (`compatible`, `incompatible`, `unknown`).
- **Product Catalog & Search**: Real-time keyword search across titles, descriptions, categories, SKUs, and manufacturer part numbers.
- **Cart & Stock Management**: Client-side persisted shopping cart with automated inventory validation and stock conflict resolution.
- **Simulated Checkout**: Multi-step checkout process with delivery calculation, order summary, and sandbox credit card simulation.
- **Order Tracking**: Immediate order confirmation and tracking lookup via unique order references.
- **Admin Control Panel**: Dedicated management portal (`/admin`) for real-time overview analytics, order fulfillment status updates, atomic inventory adjustments, catalog price/visibility editing, vehicle fitment lookup, and system retention maintenance.
- **File-Backed JSON Storage**: Lightweight, zero-external-database persistence with file locking and atomic updates (`data/runtime.store.json`).

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js**: `v22.x` LTS or newer (tested on Node v22.20+)
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

## Production Deployment

To create an optimized production build and run the production server:

```bash
# 1. Build the production package
npm run build

# 2. Start the production server
npm run start
```

By default, the production server will listen on `http://localhost:3000`. To customize the port:
```bash
npm run start -- -p 8080
```

---

## Demo Card Information

The checkout uses a sandbox simulation. No actual credit card transactions are processed. Use the following test card values during checkout:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: Any future date (e.g. `12/28`)
- **CVC**: Any 3 or 4 digits (e.g. `123`)
- **Cardholder Name**: Any name (e.g. `Demo User`)

---

## Admin Control Panel

Access the administrator portal directly at `http://localhost:3000/admin` (or click **Admin** in the site header / footer).

### Key Features:
- **📊 Overview Dashboard (`/admin`)**: Real-time sales metrics (Total Gross Revenue in LKR, Orders count, Low Stock count, Active SKUs), recent customer orders list, and low-stock inventory alerts.
- **📦 Orders Management (`/admin/orders`)**: Filter by status (`confirmed`, `processing`, `dispatched`, `delivered`, `cancelled`) or payment method, search by reference / customer name / phone, and open the full order inspector drawer to see customer contact, delivery destination, vehicle snapshot, itemized parts, and change order fulfillment status.
- **🏷️ Products & Inventory (`/admin/products`)**: Real-time inventory table with one-click atomic stock increments/decrements (+ / -), direct stock input, category and stock level filters, and product editing modal (modify price in LKR, stock count, featured badge, and active/inactive status).
- **🚗 Vehicles & Fitment (`/admin/vehicles`)**: Vehicle compatibility catalog with search by Year, Make, Model and mapped compatible part counts.
- **⚙️ System Maintenance & Settings (`/admin/settings`)**: View store retention policy, trigger on-demand retention purges, execute atomic database reseeds / resets (`--reset`), and export store JSON snapshots.

---

## Available Scripts

The following commands are defined in [`package.json`](file:///d:/VectraAuto/VectraAuto/package.json):

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
├── public/                  # Static assets (images, icons, product media)
├── scripts/                 # Maintenance, seeding, and retention scripts
├── specs/                   # Product requirements, specifications, and architecture
├── src/
│   ├── app/                 # Next.js App Router pages and API route handlers
│   ├── components/          # React UI components (Cart, Catalog, Fitment, Checkout)
│   ├── lib/                 # Shared utilities, currency formatters, and helpers
│   ├── server/              # Server-side business logic, storage engines, repository
│   └── styles/              # Global CSS & Tailwind styling
├── .env.example             # Template for environment configuration
├── next.config.ts           # Next.js configuration
├── package.json             # NPM dependencies and project scripts
├── playwright.config.ts     # Playwright E2E testing configuration
├── tsconfig.json            # TypeScript configuration
└── vitest.config.ts         # Vitest unit test configuration
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

### Resetting corrupted or test order data
To clean up test orders and restore all product inventory back to original quantities:
```bash
npm run seed -- --reset
```
