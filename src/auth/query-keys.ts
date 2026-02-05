/**
 * Centralized query key management for auth-related queries
 * Following React Query best practices
 */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}
