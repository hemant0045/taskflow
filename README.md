# TaskFlow — React frontend project

A responsive task management app built with React 19.3, TypeScript, and Vite. It is frontend-only and stores tasks and theme preference in browser localStorage.

## Requirements
- Node.js 20.19+ or 22.12+ (recommended for Vite 8)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown in your terminal (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Features
- Add, edit, delete, complete tasks
- Search tasks and filter by priority
- Views for All tasks, Today, Upcoming, Completed, and categories
- Dashboard statistics and completion rate
- Responsive mobile layout
- Light/dark theme
- Local persistence with localStorage

No backend or database is included. Data remains in the current browser profile and is not synced across devices.
