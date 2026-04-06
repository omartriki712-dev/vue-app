<!-- pages/PlanningPage.vue -->
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

      <section class="content">
        <h2 class="section-title">{{ ueTitle }}</h2>

        <!-- Bloc session d'évaluation -->
        <SessionEvaluation
          v-if="currentStatus !== 'en-cours'"
          :status="currentStatus"
          @open="showModal = true"
        />

        <!-- Bloc informatif si en cours -->
        <div v-else class="session-bar session-bar--active">
          <div class="session-left">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span class="session-label">Session d'évaluation</span>
            <span class="status-tag status-tag--en-cours">
              <svg
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              En cours
            </span>
          </div>
          <div class="session-dates" v-if="session.openDate && session.closeDate">
            <span class="date-chip">
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Ouverture : {{ formatDate(session.openDate) }}
            </span>
            <span class="date-sep">→</span>
            <span class="date-chip">
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Clôture : {{ formatDate(session.closeDate) }}
            </span>
          </div>
        </div>

        <!-- Résumé UE -->
        <UeSummaryGrid
          v-if="ue"
          :progress="ue.progress"
          :completed="ue.completed"
          :total="ue.total"
          :code="ue.code"
        />

        <!-- Placeholder statistiques -->
        <div class="stats-placeholder">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="#c4baf0"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <p>Les statistiques détaillées s'afficheront ici une fois la session terminée.</p>
        </div>
      </section>
    </main>

    <!-- Modal planification -->
    <PlanifierSessionModal
      v-if="ue"
      v-model="showModal"
      :ue-code="ue.code"
      :ue-title="ue.title"
      :status="currentStatus"
      :open-date="session.openDate"
      :close-date="session.closeDate"
      @confirm="handleSessionConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import SessionEvaluation from '../../components/teacher/SessionEvaluation.vue'
import PlanifierSessionModal from '../../components/teacher/PlanifierSessionModal.vue'
import UeSummaryGrid from '../../components/teacher/UeSummaryGrid.vue'

const route = useRoute()
const router = useRouter()

const enseignant = reactive({ prenom: 'Jean', nom: 'Dupont', email: 'prof@univ-jfc.fr' })

const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}

// ─── Paramètres reçus via router (query ou params) ───────────────────────────
// Route attendue : /enseignant/planning?promo=fie3&ueId=1
const promoName = computed(
  () => (route.query.promo as string)?.toUpperCase().replace(/(\D+)(\d)/, '$1 $2') ?? '',
)
const ueId = computed(() => Number(route.query.ueId) || null)

// ─── Store local simulé — à remplacer par un vrai store/API ──────────────────
const allUes = [
  {
    id: 1,
    code: 'E3-2-IN3',
    title: 'Conception centrée utilisateur',
    subtitle: 'E3-2-IN Ingénierie numérique',
    progress: 75,
    completed: 45,
    total: 60,
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
    icon: 'code' as const,
    status: 'planifie' as const,
  },
  {
    id: 3,
    code: 'E4-2-IMTNS-4',
    title: 'Outils d’analyse et de modélisation des flux en santé',
    subtitle: 'E4-2-IMTNS - Ingénierie et Management de la Transformation Numérique en Santé',
    progress: 87,
    completed: 52,
    total: 60,
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
    icon: 'people' as const,
    status: 'planifie' as const,
  },
  {
    id: 5,
    code: 'A3-ISI2-2',
    title: "Outils d'ingéniérie logicielle",
    subtitle: "A3-ISI2 - Informatique et systèmes d'information 2",
    progress: 0,
    completed: 0,
    total: 60,
    icon: 'code' as const,
    status: 'a-planifier' as const,
  },
]

const ue = computed(() => allUes.find((u) => u.id === ueId.value) ?? null)
const ueTitle = computed(() => ue.value?.title ?? '')

const headerBreadcrumbs = computed(() => [
  { label: '⌂ Accueil', to: '/enseignant' },
  { label: promoName.value || 'Promotion', to: '/enseignant' },
  { label: ueTitle.value || 'Enseignement', current: true },
])

// ─── Statut local (réactif, peut être mis à jour après confirmation) ─────────
const currentStatus = ref<'a-planifier' | 'planifie' | 'en-cours'>(
  ue.value?.status ?? 'a-planifier',
)

// ─── Session dates ────────────────────────────────────────────────────────────
const showModal = ref(false)
const session = reactive({ openDate: '', closeDate: '' })

function handleSessionConfirm(payload: { openDate: string; closeDate: string }) {
  session.openDate = payload.openDate
  session.closeDate = payload.closeDate
  currentStatus.value = 'planifie'
  // → appel API ici
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
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
  max-width: 1100px;
  width: 100%;
}

/* ── Content ── */
.content {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 4px;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
}

/* ── Session bar (en-cours variant) ── */
.session-bar--active {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 14px;
  padding: 14px 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.session-left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a4270;
}
.session-label {
  font-size: 14px;
  font-weight: 500;
  color: #2d2455;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  padding: 3px 9px 3px 7px;
}
.status-tag--en-cours {
  background: #eaf6ee;
  color: #2a9151;
}

.session-dates {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #5b4fcf;
  background: #eeebfa;
  border-radius: 8px;
  padding: 4px 10px;
  font-weight: 500;
}
.date-sep {
  color: #c4baf0;
  font-size: 16px;
}

/* ── Summary grid ── */
.ue-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.summary-card {
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-label {
  font-size: 11px;
  font-weight: 600;
  color: #a09cb8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e1848;
  line-height: 1;
}
.summary-value.code {
  font-size: 18px;
  color: #5b4fcf;
  background: #eeebfa;
  border-radius: 8px;
  padding: 4px 10px;
  align-self: flex-start;
}
.summary-total {
  font-size: 16px;
  color: #a09cb8;
  font-weight: 500;
}

.summary-progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar {
  height: 6px;
  background: #e9e8f0;
  border-radius: 999px;
  flex: 1;
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  background: #40248d;
  border-radius: inherit;
  transition: width 0.4s ease;
}

/* ── Placeholder stats ── */
.stats-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  border: 1.5px dashed #ddd8f4;
  border-radius: 16px;
  padding: 48px 24px;
  color: #b8b2d4;
  font-size: 14px;
  text-align: center;
}

/* ── Responsive ── */
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
  .left h1 {
    font-size: 28px;
  }
}

@media (max-width: 760px) {
  .left h1 {
    font-size: 24px;
  }
  .ue-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .left h1 {
    font-size: 20px;
  }
  .ue-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
