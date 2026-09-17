-- AlterEnum
-- Adds the two roles that application code (src/lib/permissions.ts,
-- src/auth.config.ts, and the /admin, /officer, /super-admin portal
-- layouts) has assumed exist since those portals were built, but which
-- were never actually added to the database enum. Until this migration
-- runs, these roles are only reachable via the `demo_role` cookie
-- (gated by ENABLE_DEMO_MODE) — no real account can hold them and
-- updateUserRole() cannot assign them.
--
-- Postgres requires ALTER TYPE ... ADD VALUE to run outside of an
-- explicit transaction block, and a newly added enum value cannot be
-- used in the same transaction it was created in — so this file
-- intentionally contains only the ALTER TYPE statements.
ALTER TYPE "UserRole" ADD VALUE 'DEPARTMENT_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';
