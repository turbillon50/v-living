# Fractional Living

## Overview

**FRACTIONAL LIVING** is a luxury real estate fractional ownership platform by All Global Holding LLC. It aims to integrate property, usage, and value into a single, real, legal, and inheritable fractional asset, focusing on the Caribbean market.

The platform includes:
- A pre-reservation system for luxury properties, allowing users to select exactly 3 weeks out of 56 available weeks for their fractional ownership.
- Capabilities for users to explore properties, experiences, and manage reservations.
- Features for creators to add new properties and experiences.
- Integration with AI assistant ALIX to guide users.
- Development of a banking and real estate module for traditional property sales and credit applications.
- Integration with travel services for flights and hotels, applying an 8% markup on prices.
- An Ecosystem API to facilitate bidirectional data flow with external platforms like ALIX AI, Broker Network, Vanddi, and Hub.

## User Preferences

Preferred communication style: Simple, everyday language.
Idioma preferido: Español

## System Architecture

The project employs a modern web architecture with distinct frontend and backend components, a robust data layer, and integration with several external services.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS v4 with shadcn/ui (New York style)
- **Build Tool**: Vite
- **Design System**: Cinematic Apple TV-inspired theme with white backgrounds, dark text, brand gradients (emerald to aqua), and specific fonts (Cormorant Garamond, Inter). Features full-bleed cinematic image cards for navigation, `PropertyCardCarousel` component, mobile-first PWA design, and a 5-tab BottomNav.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api` prefix
- **Build**: esbuild

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts`
- **Validation**: Zod schemas generated from Drizzle schemas
- **Migrations**: Drizzle Kit with push-based migrations
- **Key Tables**: `properties`, `pre_bookings`, `real_estate_listings`, `credit_applications`, `api_keys`, `platforms`, `platform_api_keys`, `webhooks`, `ecosystem_events`.

### API Endpoints Overview
- **Properties**: CRUD operations, filtering by category, booking week management.
- **Pre-Bookings**: Creation and retrieval of 5-day hold reservations.
- **Real Estate & Banking**: CRUD for traditional property listings, credit application submission and status updates.
- **Duffel Travel**: Flight search, hotel search, offer details with 8% markup.
- **Clerk Webhook**: Handles `user.created`, `user.updated`, `user.deleted` events for user synchronization.
- **ALIX 2.4 Integration**: Provides CRUD for ALIX AI's internal data (properties, leads, bookings, announcements, subscribers) via API key management.
- **Ecosystem API v1**: Manages cross-platform integration (ALIX AI, Broker Network, Vanddi, Hub) with platform authentication, scoped API keys, webhook system, and bulk data sync capabilities.

## External Dependencies

- **Database**: PostgreSQL (via `DATABASE_URL`)
- **PostgreSQL Client**: `pg`
- **UI Components**: Radix UI (headless components), Lucide React (icons), Embla Carousel (sliders)
- **Form Handling**: React Hook Form with Zod resolver
- **Travel API**: Duffel API (for flights and hotels)
- **Authentication**: Clerk (for user management and webhooks)
- **AI Integration**: ALIX AI (https://alix-ai.net)
- **Ecosystem Integration**: Broker Network, Vanddi, Hub (via custom Ecosystem API)