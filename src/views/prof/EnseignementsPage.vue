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

      <EnseignementsList :promo-name="promoName" :ues="ues" @ue-select="handleUeSelect" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import EnseignementsList from '../../components/teacher/EnseignementsList.vue'

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

const headerBreadcrumbs = computed(() => {
  const crumbs: Array<{
    label: string
    to?: string | { name: string; query?: Record<string, unknown> }
    current?: boolean
  }> = [
    { label: '⌂ Accueil', to: '/enseignant' },
    { label: 'Historique', to: '/enseignant/history' },
    { label: `${startYear.value}–${endYear.value}`, to: { name: 'Filiere', query: { year: startYear.value } }, current: !promoName.value },
  ]

  if (promoName.value) {
    crumbs.push({
      label: promoName.value,
      to: semesterLabel.value
        ? { name: 'Semesters', query: { year: startYear.value, promo: promoId.value } }
        : undefined,
      current: !semesterLabel.value,
    })
  }

  if (semesterLabel.value) {
    crumbs.push({ label: semesterLabel.value, current: true })
  }

  return crumbs
})

const ues = ref([
  { id: 1, code: 'UE501', title: 'Fondamentaux',           subtitle: 'Mathématiques et sciences de base',      progress: 75, completed: 45, total: 60, icon: 'book'      as const },
  { id: 2, code: 'UE502', title: 'Informatique',           subtitle: 'Développement logiciel et systèmes',     progress: 87, completed: 52, total: 60, icon: 'code'      as const },
  { id: 3, code: 'UE503', title: 'Langues & Communication',subtitle: 'Anglais technique et communication',     progress: 63, completed: 38, total: 60, icon: 'translate' as const },
  { id: 4, code: 'UE504', title: 'Management & Projet',    subtitle: 'Gestion de projet et méthodologies',     progress: 33, completed: 20, total: 60, icon: 'people'    as const },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}

function handleUeSelect(ue: { id: number; code: string; title: string }) {
  console.log('UE selected:', ue)
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
  max-width: 900px;
}

@media (max-width: 980px) {
  .page-layout { grid-template-columns: 1fr; }
  .sidebar-zone { display: none; }
  .dashboard-zone { padding: 16px; max-width: none; }
}
</style>
