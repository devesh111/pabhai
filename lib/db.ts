/**
 * Prisma Client Singleton
 * 
 * This module exports a singleton instance of PrismaClient to avoid creating
 * multiple instances in development (which can exhaust database connections).
 * 
 * In development, the client is stored in globalThis to persist across hot reloads.
 * In production, a new instance is created per server process.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

/**
 * Create or retrieve the Prisma Client instance
 * - In development: reuses the same instance across hot reloads
 * - In production: creates a new instance per server process
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// Store the instance in globalThis during development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
