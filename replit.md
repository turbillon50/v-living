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
