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

      <h2 class="section-title">
          Sélectionnez un semestre<template v-if="semesterLabel"> – {{ semesterLabel }}</template>
      </h2>

      <SemesterList
        :start-year="startYear"
        :end-year="endYear"
        :semesters="semesters"
        :columns="gridColumns"
        :title-suffix="titleSuffix"
        :promo-id="promoId"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SemesterList from '../../components/teacher/SemesterList.vue'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'

const route = useRoute()
const router = useRouter()

const enseignant = reactive({
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@univ-jfc.fr',
})

const role = ref('Espace Enseignant')

const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

// Year from query
const startYear = computed(() => {
  const param = route.query.year as string
  return param ? parseInt(param) : 2025
})
const endYear = computed(() => startYear.value + 1)

// Full list of semesters
const allSemesters = ref([
  { id: 1, label: 'S1', title: 'Semestre 1', total: 3 },
  { id: 2, label: 'S2', title: 'Semestre 2', total: 3 },
  { id: 3, label: 'S3', title: 'Semestre 3', total: 3 },
  { id: 4, label: 'S4', title: 'Semestre 4', total: 3 },
  { id: 5, label: 'S5', title: 'Semestre 5', total: 3 },
  { id: 6, label: 'S6', title: 'Semestre 6', total: 3 },
  { id: 7, label: 'S7', title: 'Semestre 7', total: 3 },
  { id: 8, label: 'S8', title: 'Semestre 8', total: 3 },
  { id: 9, label: 'S9', title: 'Semestre 9', total: 3 },
  { id: 10, label: 'S10', title: 'Semestre 10', total: 3 },
])

// Mapping promo id → semester ids + display name
const promoMap: Record<string, { ids: number[]; name: string }> = {
  fie1: { ids: [1, 2], name: 'FIE 1' },
  fie2: { ids: [3, 4], name: 'FIE 2' },
  fie3: { ids: [5, 6], name: 'FIE 3' },
  fie4: { ids: [7, 8], name: 'FIE 4' },
  fie5: { ids: [9, 10], name: 'FIE 5' },
  fia3: { ids: [5, 6], name: 'FIA 3' },
  fia4: { ids: [7, 8], name: 'FIA 4' },
  fia5: { ids: [9, 10], name: 'FIA 5' },
}

const promoId = computed(() => (route.query.promo as string) ?? '')
const promoInfo = computed(() => promoMap[promoId.value] ?? null)

// Filtered semesters: 2 if promo, all 10 otherwise
const semesters = computed(() => {
  if (promoInfo.value) {
    return allSemesters.value.filter((s) => promoInfo.value!.ids.includes(s.id))
  }
  return allSemesters.value
})

// Grid columns: 2 for promo view, 5 for full view
const gridColumns = computed(() => (promoInfo.value ? 2 : 5))

// Title suffix for SemesterList
const titleSuffix = computed(() =>
  promoInfo.value ? promoInfo.value.name : `${startYear.value}–${endYear.value}`,
)

// Breadcrumb: promo name as 3rd level
const promoLabel = computed(() => promoInfo.value?.name ?? undefined)

const headerBreadcrumbs = computed(() => {
  const crumbs: Array<{
    label: string
    to?: string | { name: string; query?: Record<string, unknown> }
    current?: boolean
  }> = [
    { label: '⌂ Accueil', to: '/enseignant' },
    {label: 'Historique', to: '/enseignant/history' },
    {
      label: `${startYear.value}–${endYear.value}`,
      to: { name: 'Filiere', query: { year: startYear.value } },
      current: !promoLabel.value,
    },

  ]

  if (promoLabel.value) {
    crumbs[1].current = false
    crumbs.push({ label: promoLabel.value, current: true })
  }

  return crumbs
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

.section-title {
  margin: 18px 0 20px;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}

@media (max-width: 980px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-zone {
    display: none;
  }

  .dashboard-zone {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .dashboard-zone {
    padding: 12px;
  }
}
</style>
