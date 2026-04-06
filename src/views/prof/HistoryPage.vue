<template>
  <div class="page-layout">
    <aside class="sidebar-zone">
      <Sidebar :items="menuItems" logout-label="Déconnexion" @select="handleMenuSelect" />
    </aside>

    <main class="dashboard-zone">
      <ProfDashboardHeader
        :prenom="enseignant.prenom"
        :nom="enseignant.nom"
        :breadcrumbs="headerBreadcrumbs"
        :email="enseignant.email"
      />

      <AcademicYearList :years="academicYears" @year-select="handleYearSelect" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import AcademicYearList from '../../components/teacher/AcademicYearList.vue'

const enseignant = reactive({
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@univ-jfc.fr',
})


const route = useRoute()
const router = useRouter()

const role = ref('Espace Enseignant')
const selectedYear = ref<number | null>(null)

const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

const headerBreadcrumbs = computed(() => {
  const crumbs: Array<{ label: string; to?: string; current?: boolean }> = [
    { label: '⌂ Accueil', to: '/enseignant' },
    { label: 'Historique', current: selectedYear.value == null },
  ]

  if (selectedYear.value != null) {
    crumbs[1] = { label: 'Historique', to: '/enseignant/history' }
    crumbs.push({ label: `${selectedYear.value}–${selectedYear.value + 1}`, current: true })
  }

  return crumbs
})

const academicYears = ref([
  { id: 1, start: 2025, end: 2026 },
  { id: 2, start: 2024, end: 2025 },
  { id: 3, start: 2023, end: 2024 },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) {
    return
  }

  router.push(item.to)
}

function handleYearSelect(year: number) {
  selectedYear.value = year
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
</style>
