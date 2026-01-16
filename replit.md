# Republica

## Overview

Republica is a fractional property ownership platform inspired by Airbnb's user experience. Instead of booking short-term rentals, users browse and acquire fractional ownership units in luxury properties including villas, yachts, commercial spaces, and exclusive experiences. The platform features a week-based pre-booking system where users can reserve specific weeks of the year for their fractional ownership.

The application is branded as "Republica - Fractional Experience" and serves as the commercial/sales module for the All Living ecosystem within All Global Holding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, PropertyDetail, Dashboard, etc.)
- Reusable components in `client/src/components/`
- UI primitives from shadcn/ui in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- API utilities and mock data in `client/src/lib/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api` prefix
- **Build**: esbuild for production bundling

Key backend files:
- `server/index.ts` - Express app setup and HTTP server
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database access layer
- `server/static.ts` - Static file serving for production

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's schema builder
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit with push-based migrations (`db:push`)

Database tables:
- `properties` - Stores property listings with category, title, location, images, and conditions
- `pre_bookings` - Tracks week reservations with expiration timestamps

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Schema definitions and TypeScript types
- Validation schemas for API payloads

## External Dependencies

### Database
- **PostgreSQL** - Primary database accessed via `DATABASE_URL` environment variable
- **pg** - Node.js PostgreSQL client
- **connect-pg-simple** - Session storage (available but sessions not currently implemented)

### UI Components
- **Radix UI** - Headless component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel/slider functionality
- **cmdk** - Command palette component
- **date-fns** - Date formatting utilities

### Development Tools
- **Vite** - Development server with HMR
- **Replit Plugins** - Runtime error overlay, dev banner, cartographer for Replit environment
- **tsx** - TypeScript execution for development

### Form Handling
- **React Hook Form** with Zod resolver for form validation

### Production Build
- Custom build script (`script/build.ts`) using esbuild for server and Vite for client
- Bundles common dependencies to reduce cold start times