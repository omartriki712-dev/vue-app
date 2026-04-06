<template>
  <div class="page-layout">
    <aside class="sidebar-zone">
      <Sidebar :items="menuItems" logout-label="Déconnexion" @select="handleMenuSelect" />
    </aside>

    <main class="dashboard-zone">
      <ProfDashboardHeader
        :breadcrumbs="headerBreadcrumbs"
        :email="enseignant.email"
        :prenom="enseignant.prenom"
        :nom="enseignant.nom"
      />

      <div class="content">
        <div class="page-header">
          <h2 class="section-title">
            Enseignements clôturés
            <template v-if="semesterLabel"> – {{ semesterLabel }}</template>
          </h2>
          <p class="section-sub">Liste des évaluations closes pour ce semestre</p>
        </div>

        <MatieresClosesCard :matieres="enseignementsClos" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import MatieresClosesCard from '../../components/teacher/MatieresClosesCard.vue'

const route = useRoute()
const router = useRouter()

const enseignant = reactive({
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@univ-jfc.fr',
})

const menuItems = computed(() => [
  { key: 'home',    label: 'Accueil',    to: '/enseignant',         active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil',  active: route.path === '/enseignant/profil' },
])

// ── Query params ──────────────────────────────────────────────────────────────
const startYear = computed(() => {
  const param = route.query.year as string
  return param ? parseInt(param) : 2025
})
const endYear = computed(() => startYear.value + 1)
const semesterLabel = computed(() => (route.query.semester as string) || undefined)

const promoMap: Record<string, string> = {
  fie1: 'FIE 1', fie2: 'FIE 2', fie3: 'FIE 3',
  fie4: 'FIE 4', fie5: 'FIE 5',
  fia3: 'FIA 3', fia4: 'FIA 4', fia5: 'FIA 5',
}
const promoId   = computed(() => (route.query.promo as string) || '')
const promoName = computed(() => promoMap[promoId.value] ?? promoId.value)

// ── Breadcrumbs ───────────────────────────────────────────────────────────────
const headerBreadcrumbs = computed(() => {
  const crumbs: Array<{
    label: string
    to?: string | { name: string; query?: Record<string, unknown> }
    current?: boolean
  }> = [
    { label: '⌂ Accueil', to: '/enseignant' },
    { label: 'Historique', to: '/enseignant/history' },
    { label: `${startYear.value}–${endYear.value}`, to: { name: 'Filiere', query: { year: startYear.value } } },
  ]

  if (promoName.value) {
    crumbs.push({
      label: promoName.value,
      to: { name: 'Semesters', query: { year: startYear.value, promo: promoId.value } },
    })
  }

  if (semesterLabel.value) {
    crumbs.push({ label: semesterLabel.value, current: true })
  }

  return crumbs
})

// ── Données mock – à remplacer par appel API ──────────────────────────────────
const allEnseignements: Record<string, Array<{ nom: string; code: string; promotion: string; nbReponses: number }>> = {
  'Semestre 1': [
    { nom: 'Algorithmique',           code: 'ALGO-101',  promotion: 'FIE 1', nbReponses: 34 },
    { nom: 'Mathématiques',           code: 'MATH-101',  promotion: 'FIE 1', nbReponses: 41 },
    { nom: 'Introduction au génie',   code: 'GEN-101',   promotion: 'FIE 1', nbReponses: 28 },
  ],
  'Semestre 2': [
    { nom: 'Structures de données',   code: 'SD-201',    promotion: 'FIE 1', nbReponses: 37 },
    { nom: 'Physique appliquée',      code: 'PHY-201',   promotion: 'FIE 1', nbReponses: 30 },
    { nom: 'Anglais technique',       code: 'ANG-201',   promotion: 'FIE 1', nbReponses: 44 },
  ],
  'Semestre 3': [
    { nom: 'Base de Données',         code: 'BDD-301',   promotion: 'FIE 2', nbReponses: 38 },
    { nom: 'Réseaux',                 code: 'RES-301',   promotion: 'FIE 2', nbReponses: 25 },
    { nom: 'Génie logiciel',          code: 'GL-301',    promotion: 'FIE 2', nbReponses: 32 },
  ],
  'Semestre 4': [
    { nom: "Systèmes d'exploitation", code: 'SE-401',    promotion: 'FIE 2', nbReponses: 29 },
    { nom: 'Analyse numérique',       code: 'AN-401',    promotion: 'FIE 2', nbReponses: 36 },
    { nom: 'Management de projet',    code: 'MGT-401',   promotion: 'FIE 2', nbReponses: 22 },
  ],
  'Semestre 5': [
    { nom: 'Conception CCU',          code: 'CCU-501',   promotion: 'FIE 3', nbReponses: 42 },
    { nom: "Systèmes d'info santé",   code: 'SIS-501',   promotion: 'FIE 3', nbReponses: 31 },
    { nom: 'Intelligence artificielle', code: 'IA-501',  promotion: 'FIE 3', nbReponses: 27 },
  ],
  'Semestre 6': [
    { nom: 'Architecture logicielle', code: 'ARCH-601',  promotion: 'FIE 3', nbReponses: 33 },
    { nom: 'Cloud & DevOps',          code: 'CLOUD-601', promotion: 'FIE 3', nbReponses: 19 },
    { nom: 'Sécurité informatique',   code: 'SEC-601',   promotion: 'FIE 3', nbReponses: 26 },
  ],
}

const enseignementsClos = computed(() => {
  const base = semesterLabel.value && allEnseignements[semesterLabel.value]
    ? allEnseignements[semesterLabel.value]
    : Object.values(allEnseignements).flat()

  return base.map(e => ({ ...e, promotion: promoName.value || e.promotion, year: startYear.value }))
})

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  background: #f4f3f8;
}

.sidebar-zone {
  border-right: 1px solid #eceaf5;
  background: #f8f7fc;
}

.dashboard-zone {
  padding: 20px 28px;
}

.content {
  max-width: 820px;
}

.page-header {
  margin-bottom: 20px;
}

.section-title {
  margin: 18px 0 4px;
  color: #20174f;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.15;
}

.section-sub {
  margin: 0;
  font-size: 13px;
  color: #9893b0;
}

@media (max-width: 980px) {
  .page-layout { grid-template-columns: 1fr; }
  .sidebar-zone { display: none; }
  .dashboard-zone { padding: 16px; }
  .content { max-width: none; }
}
</style>
