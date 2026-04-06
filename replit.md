# Vue Project - Evaluation des Enseignements

## Overview
A Vue.js 3 educational management platform for evaluating teachings (Évaluation des Enseignements). Features role-based dashboards for Students, Teachers (Professeurs), and Admins.

## Tech Stack
- **Frontend**: Vue.js 3 with Vue Router 4
- **Build Tool**: Vite 6
- **CSS**: Tailwind CSS 3 + PostCSS
- **Charts**: ApexCharts, Chart.js / vue-chartjs
- **Icons**: lucide-vue-next
- **Package Manager**: npm

## Project Structure
```
src/
  app.js          - Vue app setup
  App.vue         - Root component
  main.js         - Entry point
  provider.js     - Providers/plugins
  style.css       - Global styles
  components/     - Reusable components (admin, student, teacher)
  views/          - Page-level views (admin, prof, student)
  dashboard/      - Dashboard layouts and actions
  router/         - Vue Router configuration
public/           - Static assets (images, icons)
environment.js    - Backend API URL config (default: http://127.0.0.1:8080/api)
```

## Development
- Run: `npm run dev` (serves on 0.0.0.0:5000)
- Build: `npm run build` (outputs to dist/)

## Configuration
- **Vite**: Configured to serve on `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy
- **Backend API**: Configured in `environment.js`, defaults to `http://127.0.0.1:8080/api`
- **Deployment**: Static site deployment, build output in `dist/`

## Admin Pages
- `/admin` — Dashboard with charts and stats
- `/admin/etudiants/gestion` — Full student management (CRUD + CSV import + filters)
- `/admin/enseignants` — Teacher management (CRUD + filters + profile view)
- `/admin/academique` — Academic structure management (Years → Semesters → Modules → Courses, full drill-down CRUD)
- `/admin/enseignements` — Teaching units / subjects management
- `/admin/questionnaires` — Evaluation form management
- `/admin/periodes` — Period/scheduling management

## Workflows
- **Start application**: `npm run dev` on port 5000 (webview)
