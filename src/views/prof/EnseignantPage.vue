<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import AnneeAcademique from '../../components/teacher/AnneeAcademique.vue'
import EnseignementsList from '../../components/teacher/EnseignementsList.vue'

const enseignant = reactive({
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@univ-jfc.fr',
})

const academicYear = reactive({
  start: 2025,
  end: 2026,
})

const role = ref('Espace Enseignant')

const route = useRoute()
const router = useRouter()

const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

const headerBreadcrumbs = computed(() => [{ label: '⌂ Accueil', current: true }])

// Enseignements groupés par promotion (réactif — à remplacer par appel API)
const promotions = ref([
  {
    id: 'fie3',
    name: 'FIE 3',
    ues: [
      {
        id: 1,
        code: 'E3-2-IN3',
        title: 'Conception centrée utilisateur',
        subtitle: 'E3-2-IN Ingénierie numérique',
        progress: 75,
        completed: 45,
        total: 60,
        matieres: 2,
        icon: 'book' as const,
        status: 'en-cours' as const,
      },
      {
        id: 2,
        code: 'E3-2-IS-1',
        title: "Systèmes d'information en santé",
        subtitle: 'E3-2-IS Ingénierie et Santé',
        progress: 0,
        completed: 0,
        total: 60,
        matieres: 3,
        icon: 'code' as const,
        status: 'planifie' as const,
      },
    ],
  },
  {
    id: 'fie4',
    name: 'FIE 4',
    ues: [
      {
        id: 3,
        code: 'E4-2-IMTNS-4',
        title: 'Outils d’analyse et de modélisation des flux en santé',
        subtitle: 'E4-2-IMTNS - Ingénierie et Management de la Transformation Numérique en Santé',
        progress: 87,
        completed: 52,
        total: 60,
        matieres: 2,
        icon: 'translate' as const,
        status: 'en-cours' as const,
      },
      {
        id: 4,
        code: 'E4-1-MC-3',
        title: 'Patrons de conception',
        subtitle: 'E4-1-MC Management et Conception',
        progress: 0,
        completed: 0,
        total: 60,
        matieres: 2,
        icon: 'people' as const,
        status: 'planifie' as const,
      },
    ],
  },
  {
    id: 'fia3',
    name: 'FIA 3',
    ues: [
      {
        id: 5,
        code: 'A3-ISI2-2',
        title: "Outils d'ingéniérie logicielle",
        subtitle: "A3-ISI2 - Informatique et systèmes d'information 2",
        progress: 0,
        completed: 0,
        total: 60,
        matieres: 3,
        icon: 'code' as const,
        status: 'a-planifier' as const,
      },
    ],
  },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}

function handleUeSelect(promo: { id: string }, ue: { id: number }) {
  router.push({
    name: 'Planning',
    query: { promo: promo.id, ueId: ue.id },
  })
}

function goToMatieresCloses() {
  router.push({ path: '/enseignant/profil', query: { highlight: 'closes' } })
}
</script>

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
      >
        <template #action>
          <button class="btn-closes" @click="goToMatieresCloses">
            Voir les évaluations clôturées
          </button>
        </template>
      </ProfDashboardHeader>

      <section class="promos-section">
        <AnneeAcademique :start="academicYear.start" :end="academicYear.end" />
        <EnseignementsList
          v-for="promo in promotions"
          :key="promo.id"
          :promo-name="promo.name"
          :ues="promo.ues"
          @ue-select="(ue) => handleUeSelect(promo, ue)"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  background: #FCFCFC;
}

.sidebar-zone {
  border-right: 1px solid #eceaf5;
  background: #f8f7fc;
}

.dashboard-zone {
  padding: 20px 28px;
  min-width: 0;
}

.promos-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
}

.btn-closes {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #21097e;
  border: 1.5px solid #cdb8e6;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s;
}

.btn-closes:hover {
  background: #d9d4f0;
  border-color: #937fd4;
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .dashboard-zone {
    max-width: 960px;
    padding: 20px;
  }

  .left h1 {
    font-size: 32px;
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
    max-width: none;
  }
}

@media (max-width: 760px) {
  .dashboard-zone {
    padding: 14px;
  }

  .year-section {
    justify-content: stretch;
  }

  .year-section :deep(.academic-year-card) {
    width: 100%;
  }

  .ue-section {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .ue-section :deep(.ue-card) {
    grid-template-columns: 36px 1fr;
    padding: 10px 12px;
  }

  .ue-section :deep(.left-icon) {
    width: 36px;
    height: 36px;
  }

  .ue-section :deep(h3) {
    font-size: 18px;
  }
}
</style>
