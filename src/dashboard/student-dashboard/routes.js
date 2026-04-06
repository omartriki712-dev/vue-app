const routes = [
    {
        path: '', // 👈 REQUIRED
        redirect: 'home' // 👈 clean redirect
    },
    {
        path: 'home',
        name: 'Dashboard',
        component: import('./pages/StudentPage.vue'),
    },
    {
        path: 'profile',
        name: 'profile',
        component: () => import('./pages/ProfilePage.vue'),
    },
    {
        path: 'history',
        name: 'history',
        component: () => import('./pages/HistoryPage.vue'),
    },
    {
        path: "semesters",
        name: 'semesters',
        component: () => import('./pages/StudentPage.vue'),
    },
    // Semesters & Modules
    {
        path: 'semesters/:id/modules',
        name: 'semester-modules',
        component: () => import('./pages/ModulesPage.vue'),
    },
    {
        path: 'semesters/:semesterId/modules/:moduleId/courses',
        name: 'ModuleEvaluation',
        component: () => import('./pages/ModuleEvaluationPage.vue'),
    },
    {
        path: 'semesters/:semesterId/modules/:moduleId/courses/:id/evaluate',
        name: 'Evaluate',
        component: () => import('./pages/EvaluationFormPage.vue'),
    },
    // --- New Routes for Results & Stats ---
    {
        path: 'stats',
        name: 'StatsList',
        component: () => import('./pages/StatisticsPage.vue'),
    },
    {
        path: 'semesters/:semesterId/modules/:moduleId/courses',
        name: 'StatsSubjectList',
        component: () => import('./pages/StatsSubjectList.vue'),
    },
    {
        path: 'stats/detail/:subjectId',
        name: 'SubjectStatsDetail',
        // Ensure the case matches exactly with your file system:
        component: () => import('./pages/SubjectStatsDetail.vue'),
    },
]
export default routes;
