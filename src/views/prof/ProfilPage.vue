<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/teacher/SidebarProf.vue'
import ProfileCard from '../../components/teacher/ProfileCard.vue'
import InfoPersonnellesCard from '../../components/teacher/InfoPersonnellesCard.vue'
import EvalOverviewCard from '../../components/teacher/EvalOverviewCard.vue'
import MatieresClosesCard from '../../components/teacher/MatieresClosesCard.vue'
import type { MatiereClose } from '../../components/teacher/MatieresClosesCard.vue'

// ── Enseignant connecté ──────────────────────────────────────────────────────
const enseignant = reactive({
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@univ-jfc.fr',
  role: 'Enseignant',
})

// ── Matières closes sur l'année en cours ────────────────────────────────────
const matieresCloses = ref<MatiereClose[]>([
  { nom: 'Algorithmique Avancée',     code: 'ALGO-301', promotion: 'FIE 3', nbReponses: 42, year: 2025 },
  { nom: 'Base de Données',           code: 'BDD-301',  promotion: 'FIE 3', nbReponses: 38, year: 2025 },
  { nom: 'Intelligence Artificielle', code: 'IA-401',   promotion: 'FIE 4', nbReponses: 27, year: 2025 },
  { nom: 'Machine Learning',          code: 'ML-501',   promotion: 'FIE 5', nbReponses: 19, year: 2024 },
])

const nbMatieresAnnee = ref(9)
const nbEvaluees = computed(() => matieresCloses.value.length)
const totalReponses = computed(() => matieresCloses.value.reduce((sum, m) => sum + m.nbReponses, 0))

// ── Highlight section matières closes via query param ────────────────────────
const route = useRoute()
const router = useRouter()
const isHighlighted = ref(false)

onMounted(() => {
  if (route.query.highlight === 'closes') {
    // Petite temporisation pour laisser le DOM se stabiliser
    setTimeout(() => {
      const el = document.getElementById('section-matieres-closes')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        isHighlighted.value = true
        // Retire le highlight après 3 s
        setTimeout(() => { isHighlighted.value = false }, 3000)
      }
      // Nettoie l'URL (optionnel)
      router.replace({ path: '/profil' })
    }, 150)
  }
})

// ── Navigation sidebar ───────────────────────────────────────────────────────
const menuItems = computed(() => [
  { key: 'home', label: 'Accueil', to: '/enseignant', active: route.path === '/enseignant' },
  { key: 'history', label: 'Historique', to: '/enseignant/history', active: route.path === '/enseignant/history' },
  { key: 'profile', label: 'Mon Profil', to: '/enseignant/profil', active: route.path === '/enseignant/profil' },
])

function handleMenuSelect(item: { to?: string }) {
  if (!item.to || item.to === route.path) return
  router.push(item.to)
}
</script>

<template>
  <div class="page-layout">
    <!-- Sidebar -->
    <aside class="sidebar-zone">
      <Sidebar :items="menuItems" logout-label="Déconnexion" @select="handleMenuSelect" />
    </aside>

    <!-- Contenu principal -->
    <main class="main-zone">
      <!-- En-tête page -->
      <header class="page-header">
        <div>
          <h1>Mon Profil</h1>
          <p class="sub">Informations de votre compte enseignant</p>
        </div>
      </header>

      <!-- Carte profil (avatar + nom + email + badges) -->
      <ProfileCard
        :prenom="enseignant.prenom"
        :nom="enseignant.nom"
        :email="enseignant.email"
        :role="enseignant.role"
        class="section-card"
      />

      <!-- Ligne : Informations personnelles + Aperçu évaluations -->
      <div class="two-cols">
        <InfoPersonnellesCard
          :email="enseignant.email"
          :nom="enseignant.nom"
          :prenom="enseignant.prenom"
          :nb-matieres="nbMatieresAnnee"
          :nb-evaluees="nbEvaluees"
        />
        <EvalOverviewCard :nb-matieres="nbEvaluees" :total-reponses="totalReponses" />
      </div>

      <!-- Matières closes — section highlightable -->
      <div
        id="section-matieres-closes"
        class="closes-wrapper"
        :class="{ 'closes-wrapper--highlight': isHighlighted }"
      >
        <MatieresClosesCard :matieres="matieresCloses" />
      </div>
    </main>
  </div>
</template>

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

.main-zone {
  padding: 28px 32px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* En-tête */
.page-header {
  margin-bottom: 4px;
}

h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #1e1848;
  line-height: 1.1;
}

.sub {
  margin: 4px 0 0;
  color: #8d88a4;
  font-size: 14px;
}

/* Grille 2 colonnes pour info perso + aperçu évaluations */
.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* ── Wrapper highlight ───────────────────────────── */
.closes-wrapper {
  border-radius: 18px;
  /* transition douce pour le highlight */
  transition: box-shadow 0.4s ease, background 0.4s ease;
  scroll-margin-top: 24px; /* espace au-dessus lors du scrollIntoView */
}

.closes-wrapper--highlight {
  /* Pulse : anneau violet brillant qui s'estompe */
  animation: highlight-pulse 3s ease forwards;
}

@keyframes highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(91, 79, 207, 0.5); outline: 2px solid rgba(91, 79, 207, 0.8); }
  30%  { box-shadow: 0 0 0 10px rgba(91, 79, 207, 0.12); }
  70%  { box-shadow: 0 0 0 6px rgba(91, 79, 207, 0.08); outline: 2px solid rgba(91, 79, 207, 0.4); }
  100% { box-shadow: 0 0 0 0 rgba(91, 79, 207, 0); outline: 2px solid transparent; }
}

/* Responsive */
@media (max-width: 900px) {
  .two-cols {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-zone {
    display: none;
  }

  .main-zone {
    padding: 16px;
    max-width: none;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
