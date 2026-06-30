/**
 * DEPRECATED: This file is no longer in use.
 *
 * Badge seeding is now handled exclusively by `prisma/seed.ts`.
 * Run `npx prisma db seed` to seed the 6 canonical badges defined there.
 *
 * GamificationService.seedBadges() and BADGES_CONFIG have been removed to
 * eliminate duplicate badge definitions. The checkAndAwardBadges() method
 * queries the Badge table dynamically and does not use any hardcoded config.
 */

console.warn(
  "[seed-badges] DEPRECATED: Use `npx prisma db seed` instead. This file is no longer functional."
);
