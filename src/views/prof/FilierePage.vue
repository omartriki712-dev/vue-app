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

      <section class="content">
        <h2 class="section-title">
          Sélectionnez une filière<template v-if="semesterLabel"> – {{ semesterLabel }}</template>
        </h2>

        <!-- FIE group -->
        <FiliereSectionHeader
          label="Formation Initiale (FIE)"
          subtitle="Parcours classique"
          variant="fie"
        />
        <div class="promo-grid">
          <PromotionCard
            v-for="promo in fiePromos"
            :key="promo.id"
            :number="promo.number"
            :name="promo.name"
            :description="promo.description"
            variant="fie"
            @click="handlePromoSelect(promo)"
          />
        </div>

        <!-- FIA group -->
        <FiliereSectionHeader
          label="Formation par Alternance (FIA)"
          subtitle="Parcours en entreprise"
          variant="fia"
        />
        <div class="promo-grid">
          <PromotionCard
            v-for="promo in fiaPromos"
            :key="promo.id"
            :number="promo.number"
            :name="promo.name"
            :description="promo.description"
            variant="fia"
            @click="handlePromoSelect(promo)"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import FiliereSectionHeader from '../../components/teacher/FiliereSectionHeader.vue'
import PromotionCard from '../../components/teacher/PromotionCard.vue'

const route = useRoute()
const router = useRouter()

const enseignant = reactive({
  prenom: 'Jean',
  nom: '  Dupont',
  email: 'jean.dupont@univ-jfc.fr',
})

const role = ref('Espace Enseignant')

const pageTitle = computed(() =>
  enseignant.prenom
    ? `Bonjour, ${enseignant.prenom} ${enseignant.nom} 👋`
    : `Bonjour, Professeur 👋`,
)

const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

const headerBreadcrumbs = computed(() => {
  const crumbs: Array<{
    label: string
    to?: string | { name: string; query?: Record<string, unknown> }
    current?: boolean
  }> = [
    { label: '⌂ Accueil', to: '/enseignant' },
    { label: 'Historique', to: '/enseignant/history' },
    {
      label: `${startYear.value}–${endYear.value}`,
      current: !semesterLabel.value,
    },
  ]

  if (semesterLabel.value) {
    crumbs.push({ label: semesterLabel.value, current: true })
  }

  return crumbs
})

// Year from query
const startYear = computed(() => {
  const param = route.query.year as string
  return param ? parseInt(param) : 2025
})
const endYear = computed(() => startYear.value + 1)

// Semester from query (optional)
const semesterLabel = computed(() => {
  return (route.query.semester as string) || ''
})

// FIE promotions
const fiePromos = ref([
  { id: 'fie1', number: 1, name: 'FIE 1', description: '1ère année' },
  { id: 'fie2', number: 2, name: 'FIE 2', description: '2ème année' },
  { id: 'fie3', number: 3, name: 'FIE 3', description: '3ème année' },
  { id: 'fie4', number: 4, name: 'FIE 4', description: '4ème année' },
  { id: 'fie5', number: 5, name: 'FIE 5', description: '5ème année' },
])

// FIA promotions
const fiaPromos = ref([
  { id: 'fia3', number: 3, name: 'FIA 3', description: '3ème année alternance' },
  { id: 'fia4', number: 4, name: 'FIA 4', description: '4ème année alternance' },
  { id: 'fia5', number: 5, name: 'FIA 5', description: '5ème année alternance' },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}

function handlePromoSelect(promo: { id: string; name: string }) {
  router.push({
    name: 'Semesters',
    query: {
      year: startYear.value,
      promo: promo.id,
    },
  })
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
  margin-top: 4px;
}

.section-title {
  margin: 18px 0 4px;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 8px;
}

@media (max-width: 1300px) {
  .promo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1050px) {
  .promo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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

@media (max-width: 760px) {
  .promo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .promo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
