import { createRouter, createWebHistory } from 'vue-router';

// Importing views
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import StudentPage from '../views/student/StudentPage.vue';
import StudentProfilePage from '../views/student/StudentProfilePage.vue';
import ModulesPages from '../views/student/ModulesPages.vue';
import ModuleEvaluationPage from '../views/student/ModuleEvaluationPage.vue';
import EvaluationFormPage from '../views/student/EvaluationFormPage.vue';
import StatsSemesterList from '../views/student/StatsSemesterList.vue';
import StatsSubjectList from '../views/student/StatsSubjectList.vue';
import SubjectStatsDetail from '../views/student/SubjectStatsDetail.vue';
import EnseignantPage from '../views/prof/EnseignantPage.vue';
import ProfHistoryPage from '../views/prof/HistoryPage.vue';
import SemesterPage from '../views/prof/SemesterPage.vue';
import FilierePage from '../views/prof/FilierePage.vue';
import EnseignementsPage from '../views/prof/EnseignementsPage.vue';
import SemestreEnseignementsPage from '../views/prof/SemestreEnseignementsPage.vue';
import ProfilPage from '../views/prof/ProfilPage.vue';
import PlanningPage from '../views/prof/PlanningPage.vue';
import ResultatsEnseignementPage from '../views/prof/ResultatsEnseignementPage.vue';
import AdminLayout from '../views/admin/AdminLayout.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminStudents from '../views/admin/AdminStudents.vue';
import AdminStudentsManage from '../views/admin/AdminStudentsManage.vue';
import AdminTeachers from '../views/admin/AdminTeachers.vue';
import AdminAcademic from '../views/admin/AdminAcademic.vue';
import AdminCourses from '../views/admin/AdminCourses.vue';
import AdminForms from '../views/admin/AdminForms.vue';
import AdminPeriods from '../views/admin/AdminPeriods.vue';
import StudentHistoryPage from '../views/student/StudentHistoryPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/student', name: 'Dashboard', component: StudentPage, meta: { requiresAuth: true } },
  { path: '/student/profile', name: 'Profile', component: StudentProfilePage, meta: { requiresAuth: true } },
  { path: '/semestre/:id', name: 'Modules', component: ModulesPages, meta: { requiresAuth: true } },
  { path: '/module/:id', name: 'ModuleEvaluation', component: ModuleEvaluationPage, meta: { requiresAuth: true } },
  { path: '/evaluate/:subjectId', name: 'Evaluate', component: EvaluationFormPage, meta: { requiresAuth: true } },
  { path: '/student/stats', name: 'StatsList', component: StatsSemesterList, meta: { requiresAuth: true } },
  { path: '/stats/semester/:id', name: 'StatsSubjectList', component: StatsSubjectList, meta: { requiresAuth: true } },
  { path: '/stats/detail/:subjectId', name: 'SubjectStatsDetail', component: SubjectStatsDetail, meta: { requiresAuth: true } },
  { path: '/enseignant', name: 'Enseignant', component: EnseignantPage, meta: { requiresAuth: true } },
  { path: '/student/history', name: 'History', component: StudentHistoryPage, meta: { requiresAuth: true } },
  { path: '/enseignant/history', name: 'EnseignantHistory', component: ProfHistoryPage, meta: { requiresAuth: true } },
  { path: '/enseignant/semesters', alias: '/semesters', name: 'Semesters', component: SemesterPage, meta: { requiresAuth: true } },
  { path: '/enseignant/filiere', alias: '/filiere', name: 'Filiere', component: FilierePage, meta: { requiresAuth: true } },
  { path: '/enseignant/enseignements', alias: '/enseignements', name: 'Enseignements', component: EnseignementsPage, meta: { requiresAuth: true } },
  { path: '/enseignant/semestre/enseignements', name: 'SemestreEnseignements', component: SemestreEnseignementsPage, meta: { requiresAuth: true } },
  { path: '/enseignant/profil', alias: '/profil', name: 'Profil', component: ProfilPage, meta: { requiresAuth: true } },
  { path: '/enseignant/planning', name: 'Planning', component: PlanningPage, meta: { requiresAuth: true } },
  { path: '/enseignant/profil/resultats/:code', name: 'ResultatsEnseignement', component: ResultatsEnseignementPage, meta: { requiresAuth: true } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'etudiants', name: 'AdminStudents', component: AdminStudents },
      { path: 'etudiants/gestion', name: 'AdminStudentsManage', component: AdminStudentsManage },
      { path: 'enseignants', name: 'AdminTeachers', component: AdminTeachers },
      { path: 'academique', name: 'AdminAcademic', component: AdminAcademic },
      { path: 'enseignements', name: 'AdminCourses', component: AdminCourses },
      { path: 'questionnaires', name: 'AdminForms', component: AdminForms },
      { path: 'periodes', name: 'AdminPeriods', component: AdminPeriods },
    ]
  },
  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = true; // Replace with real auth logic
  const isAdmin = true; // Replace with real role logic

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/enseignant');
  } else {
    next();
  }
});

export default router;