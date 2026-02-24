# Fractional Living

## Overview

**FRACTIONAL LIVING** - All Global Holding LLC

Plataforma de fracciones inmobiliarias de lujo que conecta propiedad, uso y valor en un solo activo.
Vive, invierte y construye patrimonio en el Caribe bajo un modelo fractional real, legal y heredable.

La plataforma cuenta con un sistema de pre-reserva basado en semanas (56 semanas) donde los usuarios pueden seleccionar exactamente 3 semanas para su fracción.

## Funcionalidades Completas de la App

### Para Usuarios

1. **Explorar Experiencias**
   - Navegar por categorías: Propiedades, Yachts, Experiences, Commercial, Rewards & Benefits, Last Minute Access
   - Filtrar propiedades por categoría
   - Ver galería de imágenes de alta calidad

2. **Ver Detalles de Propiedad**
   - Descripción completa de la propiedad
   - Galería de imágenes con carrusel
   - Condiciones y términos de la propiedad
   - Ubicación

3. **Sistema de Pre-Reserva (52 Semanas)**
   - Calendario visual de 52 semanas del año
   - Seleccionar exactamente 3 semanas para reservar
   - Las semanas ya reservadas aparecen como no disponibles
   - Ingreso solo con email (sin pago requerido)
   - Reserva con hold de 5 días automático
   - Las reservas expiran automáticamente después de 5 días

4. **Asistente Alex AI**
   - Botón flotante para asistencia
   - Guía a los usuarios durante el proceso

### Para Creadores (Modo Creador)

1. **Acceso Protegido**
   - Contraseña requerida: `lumamijuvisado`
   - Una vez desbloqueado, permanece activo durante la sesión

2. **Crear Nuevas Experiencias**
   - Seleccionar categoría
   - Agregar título y ubicación
   - Escribir descripción
   - Subir imágenes
   - Publicación instantánea a la base de datos

## User Preferences

Preferred communication style: Simple, everyday language.
Idioma preferido: Español

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, PropertyDetail)
- Reusable components in `client/src/components/`
- UI primitives from shadcn/ui in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- API utilities in `client/src/lib/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api` prefix
- **Build**: esbuild for production bundling

Key backend files:
- `server/index.ts` - Express app setup and HTTP server
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database access layer with Drizzle ORM
- `server/seed.ts` - Database seeding script

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's schema builder
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit with push-based migrations (`db:push`)

Database tables:
- `properties` - Stores property listings with category, title, location, images, and conditions
- `pre_bookings` - Tracks week reservations with email, selected weeks, and 5-day expiration timestamps

### API Endpoints

- `GET /api/properties` - Listar todas las propiedades
- `GET /api/properties/:id` - Obtener una propiedad específica
- `GET /api/properties/category/:category` - Filtrar por categoría
- `POST /api/properties` - Crear nueva propiedad (Creator Mode)
- `GET /api/properties/:id/bookings` - Obtener semanas reservadas
- `POST /api/pre-bookings` - Crear pre-reserva
- `GET /api/pre-bookings/:email` - Ver reservas por email

### Duffel Travel Integration

Key backend file:
- `server/duffel-routes.ts` - Flight search (live) and hotel search (test) routes with 8% markup

Endpoints:
- `GET /api/duffel/config` - Check Duffel service status and markup config
- `GET /api/duffel/airports?q=` - Search airports/cities by name (autocomplete)
- `POST /api/duffel/flights/search` - Search flights (uses DUFFEL_API_KEY_LIVE)
- `GET /api/duffel/flights/offer/:id` - Get flight offer details with available services
- `POST /api/duffel/stays/search` - Search hotels (uses DUFFEL_API_KEY_TEST, test mode)

Business Model:
- 8% markup applied to all flight and hotel prices
- Duffel Payments model: Duffel handles payment collection directly from customers
- No Stripe needed for travel bookings
- DUFFEL_API_KEY_LIVE = real flight purchases
- DUFFEL_API_KEY_TEST = test mode for flights and hotels

Frontend Pages:
- `/vuelos` - Flight search with airport autocomplete, date/passenger/class selection
- `/hoteles` - Hotel search with popular Caribbean destinations, date/room selection

### Clerk Webhook Integration

- `POST /api/clerk/webhook` - Receives Clerk webhook events with svix signature verification
- Events handled: `user.created`, `user.updated`, `user.deleted`
- Requires `CLERK_WEBHOOK_SECRET` environment variable (from Clerk Dashboard > Webhooks)
- On user.created/updated: creates or updates user in DB with clerkId, email, name, phone
- On user.deleted: marks user status as "inactive"
- Webhook URL for Clerk Dashboard: `https://allliving.org/api/clerk/webhook`

### ALIX 2.4 Integration (External AI - https://alix-ai.net)

Key backend files:
- `server/alix-middleware.ts` - Auth (Bearer token + DB keys), rate limit (100/min), CORS (alix-ai.net only), logging, custom headers
- `server/alix-routes.ts` - Full CRUD endpoints for ALIX with API key generation

Key Management:
- `POST /api/alix/generate-key` - Generate new API key (creator password required, key shown once)
- `GET /api/alix/keys` - List active keys masked (creator password in X-Creator-Password header)

Read Endpoints (require `Authorization: Bearer [API_KEY]`):
- `GET /api/alix/status` - App status (online/offline, version, uptime)
- `GET /api/alix/catalog` - Property catalog (id, nombre, categoría, disponibilidad, url)
- `GET /api/alix/stats` - Aggregated metrics (total users, active today, total bookings, leads by status)
- `GET /api/alix/announcements` - All announcements (id, título, contenido, fecha, activo)
- `GET /api/alix/leads` - All leads (id, nombre, email, interés, estatus)
- `GET /api/alix/bookings` - All bookings (id, propertyId, semanas, estatus)
- `GET /api/alix/subscribers` - All subscribers (id, email, nombre, fuente)

Write Endpoints (require `Authorization: Bearer [API_KEY]`):
- `POST /api/alix/announcements` - Create announcement
- `PUT /api/alix/announcements/:id` - Update announcement
- `DELETE /api/alix/announcements/:id` - Delete announcement
- `POST /api/alix/properties` - Create property
- `PUT /api/alix/properties/:id` - Update property
- `DELETE /api/alix/properties/:id` - Delete property
- `PUT /api/alix/leads/:id` - Update lead status
- `DELETE /api/alix/leads/:id` - Delete lead
- `POST /api/alix/subscribers` - Add subscriber

Security:
- API keys generated by the app and stored in DB (api_keys table)
- Also supports env-based ALIX_API_KEY as fallback
- Keys masked in listing endpoint (only first 8 + last 4 chars shown)
- Creator password from CREATOR_PASSWORD env var
- CORS restricted to https://alix-ai.net
- Rate limited to 100 requests/minute per IP
- All requests logged with timestamp, endpoint, IP, status

### Ecosystem API v1 (Cross-Platform Integration)

Architecture: ALIX (center) orchestrates bidirectional data flow between Fractional Living, Broker Network, Vanddi, and Hub.

Key backend files:
- `server/ecosystem-middleware.ts` - Platform auth, scope verification, dynamic CORS, rate limit (200/min), request logging, webhook signature generation
- `server/ecosystem-routes.ts` - Full ecosystem endpoints under `/api/ecosystem/v1/*`

Database tables:
- `platforms` - Registered platforms (name, slug, type, baseUrl, allowedOrigins, status, heartbeat)
- `platform_api_keys` - Scoped API keys per platform (key, scopes[], expiresAt)
- `webhooks` - Webhook subscriptions (url, secret, events[], failCount, lastDelivery)
- `ecosystem_events` - Event log/outbox (event, payload, delivered, deliveredTo)

Registered Platforms:
- **ALIX AI** (slug: `alix`) - Central AI orchestrator, scopes: read, write, admin
- **Broker Network** (slug: `broker_network`) - Real estate broker network, scopes: read, write
- **Vanddi** (slug: `vanddi`) - Luxury marketplace, scopes: read, write
- **Hub** (slug: `hub`) - Central ecosystem hub, scopes: read, write, admin

Platform Management (Creator password required):
- `POST /api/ecosystem/v1/platforms` - Register new platform (returns API key)
- `GET /api/ecosystem/v1/platforms` - List platforms (X-Creator-Password header)
- `POST /api/ecosystem/v1/platforms/:id/generate-key` - Generate additional API key

Ecosystem Data Endpoints (require `Authorization: Bearer [PLATFORM_API_KEY]`):
- `POST /api/ecosystem/v1/heartbeat` - Platform heartbeat + metadata
- `GET /api/ecosystem/v1/status` - Ecosystem status (all platforms online/offline)
- `GET /api/ecosystem/v1/properties` - Property catalog (scope: read)
- `GET /api/ecosystem/v1/properties/:id` - Single property detail (scope: read)
- `GET /api/ecosystem/v1/leads` - All leads (scope: read)
- `POST /api/ecosystem/v1/leads` - Create lead (scope: write)
- `GET /api/ecosystem/v1/bookings` - All bookings (scope: read)
- `GET /api/ecosystem/v1/users` - Users (safe fields only, scope: read)
- `GET /api/ecosystem/v1/stats` - Aggregated platform metrics (scope: read)
- `GET /api/ecosystem/v1/announcements` - Announcements (scope: read)
- `POST /api/ecosystem/v1/announcements` - Create announcement (scope: write)

Webhook System:
- `POST /api/ecosystem/v1/webhooks` - Register webhook (url, events[])
- `GET /api/ecosystem/v1/webhooks` - List platform's webhooks
- `DELETE /api/ecosystem/v1/webhooks/:id` - Delete webhook
- Supported events: property.created, property.updated, property.deleted, lead.created, lead.updated, booking.created, booking.expired, user.registered, announcement.created
- HMAC-SHA256 signature verification via X-Ecosystem-Signature header

Bulk Sync:
- `POST /api/ecosystem/v1/sync/properties` - Batch sync properties from external platform
- `POST /api/ecosystem/v1/sync/leads` - Batch sync leads from external platform

Event Log:
- `GET /api/ecosystem/v1/events` - Recent ecosystem events (scope: read)

Security:
- Per-platform API keys with scoped permissions (read, write, admin)
- Dynamic CORS based on platform's allowedOrigins
- Rate limited to 200 requests/minute per platform
- Webhook delivery with HMAC-SHA256 signing + replay protection
- User data never exposes passwords/PINs
- All requests logged with platform, IP, status, duration

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Schema definitions and TypeScript types
- Validation schemas for API payloads

## External Dependencies

### Database
- **PostgreSQL** - Primary database accessed via `DATABASE_URL` environment variable
- **pg** - Node.js PostgreSQL client

### UI Components
- **Radix UI** - Headless component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel/slider functionality

### Development Tools
- **Vite** - Development server with HMR
- **tsx** - TypeScript execution for development

### Form Handling
- **React Hook Form** with Zod resolver for form validation

### Production Build
- Custom build script (`script/build.ts`) using esbuild for server and Vite for client
