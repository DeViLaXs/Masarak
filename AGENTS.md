# AGENTS.md

## 🚀 Project Overview

**GoWork-Next.js** is a modern dashboard and management application built with **Next.js 16** (App Router). It handles company administration, user authentication, and organizational requests.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **API Client**: Axios (configured in `src/lib/axios.ts`)
- **Forms**: React Hook Form / TanStack Form (migrating to TanStack Form)
- **Validation**: Zod
- **Icons**: Lucide React

## 📂 Architecture & Structure

The project currently uses a standard Next.js layer-based structure.

### Current Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Shared components.
- `src/lib`: Core utilities (axios, utils).
- `src/services`: API service functions.

## 📏 Coding Standards & Patterns

### 1. Component Design

- Use **Shadcn UI** components from `src/components/ui` as building blocks.
- Create small, focused components.
- Place feature-specific components in their feature folder (or `src/app/(...)/_components` if temporary).

### 2. Data Fetching

- **Do not** fetch data in `useEffect` manually.
- Use **TanStack Query** hooks (`useQuery`, `useMutation`) for all API interactions.
- Define API calls in `src/services` or feature-specific service files.
- **Do not** use raw `axios` calls inside components.

### 3. Styling

- Use Tailwind CSS utility classes.
- Use `cn()` helper for class merging.
- **Avoid** custom CSS modules unless absolutely necessary for complex animations.

### 4. Authentication

- Protected routes are handled via `src/proxy.ts` (middleware-like logic) and client-side via `useAuth` hook.
- Auth state is managed via Zustand.

## 🤖 Enabled Agent Skills

This project uses specialized skills found in the `.agents/` directory:

### [React Best Practices](.agents/react-best-practices/AGENTS.md)

**Location**: `.agents/react-best-practices`
**Use when**: Implementing components, hooks, or logic.
**Key Rules**:

- Functional components only.
- Strict TypeScript usage.
- Proper error boundaries and Suspense.

### [Web Design Guidelines](.agents/web-design-guidelines/AGENTS.md)

**Location**: `.agents/web-design-guidelines`
**Use when**: Designing UI, layouts, or styling.
**Key Principles**:

- clean, modern "New York" style (Shadcn default).
- Responsive first.
- Accessible patterns.

## 📝 Workflow for Agents

1. **Check `task.md`**: Update it before starting work.
2. **Read `implementation_plan.md`**: For big features, create or update this plan first.
3. **Follow the stack**: Don't introduce new libraries without asking.
4. **Use the Skills**: Refer to the `.agents` rules when coding.
