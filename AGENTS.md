# Project instructions

## Project

- This is a Next.js project using the App Router.
- Use TypeScript and Tailwind CSS.
- Use Mongolian text for user-facing content.

## Code style

- Write simple and readable code.
- Use functional React components.
- Create reusable components inside the components folder.
- Use the @/ import alias when possible.
- Do not use any unless absolutely necessary.

## Safety

- Never expose secrets from .env.local.
- Never add API keys or passwords to source files.
- Do not edit generated files inside .next.
- Do not manually edit next-env.d.ts.
- Ask before installing a new production dependency.

## Validation

- Run pnpm lint after changing code.
- Run pnpm build before considering a larger task complete.
- Explain errors in Mongolian.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
