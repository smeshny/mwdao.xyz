# mwdao.xyz website

This repository contains the source code for the mwdao.xyz website. It’s a modern Next.js 15 application using Tailwind CSS 4, shadcn/ui, React 19 and TypeScript. The site includes public pages and open‑source tools developed by MWDAO.

Highlights
- Next.js App Router with server and client components
- Tailwind CSS 4 + shadcn/ui component system
- TypeScript, ESLint and Prettier setup
- TanStack Query (React Query) where client‑side data fetching/caching is needed
- Deployment on Vercel is recommended

Getting Started
1) Requirements: Node.js 18.17+
2) Install and run:
   - `npm install`
   - `npm run dev`
3) Open `http://localhost:3000`.

Common Scripts
- `npm run dev` — start development server (Turbopack)
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — format, lint and TypeScript check (`tsc --noEmit`)

Project Structure (selected)
- `src/app` — routes, layouts and pages
- `src/components` — shared UI blocks and primitives
- `src/lib` — utilities (e.g., SEO metadata)
- `src/feautures` — feature modules
  - `lighter-accounts-monitoring` — tool to monitor Lighter accounts (route: `/tools/lighter-accounts-monitoring`)

Notes
- If you rename or move routes and see stale type errors from `.next/types`, delete the `.next` folder and restart the dev server to regenerate types.
- Some tool data (e.g., saved wallets/groups) is stored locally in the browser via `localStorage`.

License
Open source. See project files for details.
