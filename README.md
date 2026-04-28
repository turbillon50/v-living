# v-living

Proyecto migrado desde Replit para despliegue limpio en GitHub + Vercel.

## Requisitos

- Node.js 20+
- PostgreSQL accesible desde Vercel

## Desarrollo local

1. Copia variables:

   ```bash
   cp .env.example .env.local
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Corre migraciones de Drizzle:

   ```bash
   npm run db:push
   ```

4. Inicia la app:

   ```bash
   npm run dev
   ```

## Deploy en Vercel

1. Importa este repositorio en Vercel.
2. Configura todas las variables de `.env.example` en Project Settings -> Environment Variables.
3. Ejecuta deploy.
4. Corre `npm run db:push` una vez contra tu base de datos productiva.

## Acceso rapido sin variables (modo demo)

Si despliegas sin `DATABASE_URL`, la API se inicia en modo demo:

- Rutas base como `/api/properties` responden listas vacias.
- El resto de `/api/*` responde `503` con mensaje de configuracion pendiente.
- Sirve para validar dominio, frontend y estructura mientras preparas credenciales reales.

## Notas

- No subas archivos `.env*` reales al repo.
- Las rutas `/api/*` se ejecutan como funciones serverless en Vercel.
- El frontend se sirve como estático desde `dist/public`.
