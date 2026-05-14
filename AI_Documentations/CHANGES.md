# Changes in `refactor/dev-experience`

## 🎯 Objective

This branch fundamentally improves developer experience, fixes critical UI bugs (theme flickering), and standardizes the architecture for scale.

## � Key Changes & Examples

### 1. Theme Flicker Fix & Standardization

The theming system was completely overhauled to follow `next-themes` best practices and fix the "flash of unstyled content" (FOUC).

- **Standardized `ThemeProvider`**: Removed unnecessary complexity/re-exports.
  ```tsx
  // src/components/theme-provider.tsx
  export function ThemeProvider({
    children,
    ...props
  }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
  }
  ```
- **Updated `layout.tsx`**: centralized configuration.
- **Fixed `AnimatedThemeToggler`**: Reverted to a robust manual implementation to handle mounting state correctly.

### 2. React Query Architecture (SSR-Safe)

We implemented the **Factory Pattern** for `QueryClient` to ensure data isolation during Server-Side Rendering (SSR).

- **Before**: Singleton `new QueryClient()` (unsafe for SSR).
- **After**: Factory function per request.
  ```tsx
  // src/lib/providers.tsx
  export default function ReactQueryProvider({
    children,
  }: {
    children: ReactNode
  }) {
    const queryClient = getQueryClient() // Creates new client on server, reuses on browser
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
  ```

### 3. Core Refactoring: Auth & Proxy

We introduced a custom proxy and centralized authentication logic to improve route protection and state management.

- **New Proxy Implementation**: Created `src/proxy.ts` to handle optimistic cookie-based access control, replacing the need for standard edge middleware.
- **Unified Auth Logic**: Gathered all auth-related code and hooks into `src/auth/` for better organization.
- **Unified `useAuth` Hook**:
  Centralizes sessions, redirects, and mutations.
  ```tsx
  // src/auth/use-auth.ts
  const { user, login } = useAuth({
    middleware: 'guest', // Auto-redirects logged-in users
    redirectTo: '/dashboard',
  })
  ```

### 4. File Organization & Naming

Enforced `kebab-case` for file names and better directory grouping.

| Old Name         | New Name                                |
| ---------------- | --------------------------------------- |
| `authService.ts` | `src/services/auth-service.ts`          |
| `useAuth.ts`     | `src/auth/use-auth.ts`                  |
| `AppSidebar.tsx` | `src/components/ui/app-sidebar.tsx`     |
| `_component`     | `src/app/(dashboard)/admin/_components` |

### 5. AI-Native Documentation

Added `.agents/` skills and documentation to help teammates (and AI agents) stay aligned.

- **`AGENTS.md`**: Single Source of Truth for the project stack.
- **Skills**: Imported `react-best-practices` and `web-design-guidelines`.

## 🚀 Impact

- **Zero Theme Flicker**: Smooth user experience on load.
- **SSR Stability**: No more cross-request state pollution with React Query.
- **Maintainability**: Consistent naming and unified auth logic make the codebase easier to navigate.
