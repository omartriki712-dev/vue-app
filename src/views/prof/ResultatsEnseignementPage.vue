<!-- views/ResultatsEnseignementPage.vue -->
<template>
  <div class="page-layout">
    <!-- Sidebar -->
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

      <!-- ── Content ──────────────────────────────────────────────────────── -->
      <section class="content">
        <div class="title-row">
          <h2 class="section-title">{{ ue.title }}</h2>
          <span class="context-badge">{{ ue.annee }} · {{ ue.promo }}</span>
        </div>

        <!-- Barre session Terminée (sans bouton Gérer) -->
        <div class="session-bar">
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
            <span class="status-tag status-tag--termine">
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Terminée
            </span>
          </div>
        </div>

        <!-- Cartes résumé UE -->
        <UeSummaryGrid
          :progress="ue.progress"
          :completed="ue.completed"
          :total="ue.total"
          :code="ue.code"
        />

        <!-- Graphiques (empilés verticalement) -->
        <div class="charts-col">
          <QuestionScoreChart :questions="questionResults" />
          <QuestionDistributionChart :questions="questionDistributions" :total-attendu="ue.total" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfDashboardHeader from '../../components/teacher/ProfDashboardHeader.vue'
import UeSummaryGrid from '../../components/teacher/UeSummaryGrid.vue'
import QuestionScoreChart from '../../components/teacher/QuestionScoreChart.vue'
import QuestionDistributionChart from '../../components/teacher/QuestionDistributionChart.vue'
import type { QuestionResult } from '../../components/teacher/QuestionScoreChart.vue'
import type { QuestionDistribution } from '../../components/teacher/QuestionDistributionChart.vue'


const route = useRoute()
const router = useRouter()

// ── Enseignant connecté (à remplacer par store/API) ──────────────────────────
const enseignant = reactive({ prenom: 'Jean', nom: 'Dupont', email: 'prof@univ-jfc.fr' })

// ── Menu sidebar ──────────────────────────────────────────────────────────────
const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}

// ── UE fictive récupérée via le code dans l'URL (à remplacer par API) ────────
// En prod : fetch('/api/enseignements/' + route.params.code)
// promo & annee transmis en query params par MatiereCloseRow
const promoQuery = (route.query.promo as string) || 'FIE 3'
const yearQuery  = (route.query.year  as string) || '2025'
const yearEnd    = parseInt(yearQuery) + 1

const ue = reactive({
  code:     (route.params.code as string) ?? 'ALGO-301',
  title:    'Algorithmique Avancée',
  progress: 70,
  completed: 42,
  total:    60,
  promo:    promoQuery,
  annee:    `${yearQuery}–${yearEnd}`,
})

const headerBreadcrumbs = computed(() => [
  { label: '⌂ Accueil', to: '/enseignant' },
  { label: 'Mon Profil', to: '/enseignant/profil' },
  { label: ue.title, current: true },
])

// ── Données questions (scores moyens) ─────────────────────────────────────────
const questionResults = [
  { label: "Mon enseignant m'a communiqué les règles de fonctionnement du cours", moyenne: 3.2 },
  {
    label: 'Je disposais des prérequis nécessaires pour suivre correctement le cours',
    moyenne: 2.8,
  },
  { label: "Les supports pédagogiques m'ont aidé dans mon apprentissage", moyenne: 3.1 },
  { label: "Les méthodes pédagogiques utilisées m'ont aidé à apprendre", moyenne: 2.5 },
  { label: "L'enseignant a encouragé les élèves à poser des questions", moyenne: 3.0 },
  { label: 'La charge de travail pour ce cours était adaptée', moyenne: 2.2 },
  { label: 'Le cours était redondant avec un autre cours dispensé plus tôt', moyenne: 1.5 },
  { label: "Je pense avoir été suffisamment préparé pour l'évaluation", moyenne: 2.7 },
  {
    label: "Ce cours m'a permis d'acquérir de nouvelles connaissances et compétences",
    moyenne: 3.3,
  },
] satisfies QuestionResult[]

// ── Distribution des réponses par question ────────────────────────────────────
// counts: [toutFait(4), plutotAccord(3), plutotPas(2), pasDuTout(1), neSePrononce(0)]
const questionDistributions = [
  {
    label: "Mon enseignant m'a communiqué les règles de fonctionnement du cours",
    counts: [15, 14, 8, 5, 3],
  },
  {
    label: 'Je disposais des prérequis nécessaires pour suivre correctement le cours',
    counts: [10, 16, 11, 5, 3],
  },
  {
    label: "Les supports pédagogiques m'ont aidé dans mon apprentissage",
    counts: [13, 14, 7, 7, 4],
  },
  {
    label: "Les méthodes pédagogiques utilisées m'ont aidé à apprendre",
    counts: [8, 12, 14, 7, 4],
  },
  {
    label: "L'enseignant a encouragé les élèves à poser des questions",
    counts: [12, 15, 10, 5, 3],
  },
  { label: 'La charge de travail pour ce cours était adaptée', counts: [6, 12, 14, 9, 4] },
  {
    label: 'Le cours était redondant avec un autre cours dispensé plus tôt',
    counts: [4, 8, 12, 14, 7],
  },
  {
    label: "Je pense avoir été suffisamment préparé pour l'évaluation",
    counts: [10, 13, 11, 7, 4],
  },
  {
    label: "Ce cours m'a permis d'acquérir de nouvelles connaissances et compétences",
    counts: [16, 15, 8, 4, 2],
  },
] satisfies QuestionDistribution[]
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  background: #f4f3f8;
  width: 100%;
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

/* ── Content ─────────────────────────────────────── */
.content {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
}

.context-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #2f0d73, #7c3aed);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* ── Barre session Terminée ──────────────────────── */
.session-bar {
  display: flex;
  align-items: center;
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

.status-tag--termine {
  background: #eaf6ee;
  color: #2a9151;
}

/* ── Charts empilés ──────────────────────────────── */
.charts-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Responsive ──────────────────────────────────── */
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
</style>
