# DLSJBC PPES — Frontend (React)

## Setup

```bash
npm install
cp .env.example .env
# edit VITE_API_URL if your Laravel API isn't on http://localhost:8000/api

npm run dev
```

Open http://localhost:5173 and sign in with the seeded admin account
(see backend/README.md).

## Structure
- `src/api/` — axios client + one file per API resource
- `src/context/AuthContext.jsx` — token/user state, login/logout
- `src/components/layout/` — Sidebar + page shell
- `src/components/ui/` — StatusPill, ConditionPill, StatCard
- `src/pages/` — Login, Dashboard, Equipment (list/detail/form), Reports

## Design
Industrial "blueprint" theme built for a facilities/engineering context:
ink-navy sidebar, blueprint-blue primary actions, amber accents for
attention items, monospace type reserved for property numbers and serials
(asset-tag styling), status colors mapped consistently across the dashboard,
table, and detail views.
