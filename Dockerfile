# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are embedded in the client bundle at build time.
# Using mock values. No real Supabase credentials required.
ENV NEXT_PUBLIC_USE_MOCK_DATA=true
ENV NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-mock-anon-key
ENV NEXTAUTH_SECRET=ci-mock-nextauth-secret
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (includes minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets are not included in standalone; must be copied separately
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Public folder is not included in standalone either
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
