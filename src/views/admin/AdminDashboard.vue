<template>
  <div class="page-container">
    <section class="filters-section">
      <div class="filter-group">
        <label class="filter-label">Promotion</label>
        <select class="filter-select">
          <option>Sélectionnez une Promo</option>
          <option v-for="p in ['FIE 1', 'FIE 2', 'FIE 3', 'FIE 4', 'FIE 5', 'FiA']" :key="p">{{ p }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Unité d'Enseignement (UE)</label>
        <select class="filter-select">
          <option>Sélectionnez une Unité</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Matière</label>
        <select class="filter-select">
          <option>Sélectionnez une Matière</option>
        </select>
      </div>
      <button class="filter-reset-btn">
        <RotateCcw class="h-4 w-4" />
        Réinitialiser
      </button>
    </section>

    <section class="stats-grid">
      <StatCard 
        title="Étudiants actifs"
        value="324"
        subtext="Toutes promotions confondues"
        :icon="Users"
        variant="primary"
        trend-value="+ 12%"
        trend-label="vs période précédente"
      />

      <StatCard 
        title="Enseignements"
        value="48"
        subtext="6 UE configurées"
        :icon="BookOpen"
      />

      <StatCard 
        title="Évaluations"
        value="892"
        subtext="Ce semestre"
        :icon="ClipboardList"
        trend-value="+ 8%"
        trend-label="vs période précédente"
      />

      <StatCard 
        title="Taux participation"
        value="87%"
        subtext="Moyenne globale"
        :icon="TrendingUp"
        variant="danger"
      />
    </section>

    <section class="charts-section">
      <div class="chart-card">
        <h3 class="chart-title">Taux de participation par promotion</h3>
        <div class="chart-container">
          <Bar :data="participationData" :options="barOptions" />
        </div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">Évolution du score moyen</h3>
        <div class="chart-container">
          <Line :data="evolutionData" :options="lineOptions" />
        </div>
      </div>
    </section>

    <section class="evaluations-section">
      <div class="evaluation-doughnut">
        <h3 class="chart-title">Répartition par UE</h3>
        <div class="doughnut-container">
          <Doughnut :data="ueData" :options="donutOptions" />
        </div>
      </div>

      <div class="evaluation-list">
        <div class="evaluation-list-header">
          <h3 class="chart-title">Dernières évaluations</h3>
          <button class="view-all-btn">
            Voir tout <ChevronRight class="h-4 w-4" />
          </button>
        </div>
        
        <div class="evaluations-container">
          <div v-for="item in recentEvaluations" :key="item.id" class="evaluation-item">
            <div class="evaluation-header">
              <div class="evaluation-icon">
                <BookOpen class="h-6 w-6" />
              </div>
              <div class="evaluation-info">
                <h4 class="evaluation-title">{{ item.title }}</h4>
                <p class="evaluation-ue">{{ item.ue }}</p>
              </div>
            </div>
            
            <div class="evaluation-stats">
              <div class="stat-responses">
                <p class="stat-value">{{ item.responses }}/52</p>
                <p class="stat-label">réponses</p>
              </div>
              
              <div class="stat-score-group">
                <div class="stat-score">
                  <div class="score-value">
                    {{ item.score }} <span class="score-max">/5</span>
                  </div>
                </div>
                <div class="progress-ring" :style="{ '--progress': (item.responses / 52) * 100 }">
                  <svg class="ring-svg" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" class="ring-bg" />
                    <circle cx="20" cy="20" r="18" class="ring-progress" />
                  </svg>
                  <span class="ring-percentage">{{ Math.round((item.responses / 52) * 100) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RotateCcw, Users, BookOpen, ClipboardList, TrendingUp, ChevronRight } from "lucide-vue-next";
import StatCard from '../../components/admin/StatCard.vue';
import { Bar, Line, Doughnut } from 'vue-chartjs';
import { 
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, 
  LinearScale, PointElement, LineElement, ArcElement 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement);

// --- Données des Graphiques (Simulées d'après la maquette) ---
// il va valloir les changer pour les récupérer depuis l'API

const participationData = {
  labels: ['FIE 1', 'FIE 2', 'FIE 3', 'FIE 4', 'FIE 5', 'FiA'],
  datasets: [{
    data: [78, 85, 92, 88, 98, 82],
    backgroundColor: '#7c3aed',
    borderRadius: 6,
    barThickness: 30,
  }]
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
    y: { beginAtZero: true, max: 100, ticks: { font: { size: 10 } } },
    x: { ticks: { font: { size: 10, weight: 'bold' } } }
  }
};

const evolutionData = {
  labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan'],
  datasets: [{
    data: [3.8, 4.0, 4.2, 4.0, 4.3],
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointBackgroundColor: '#fff',
    pointBorderWidth: 2
  }]
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { min: 3, max: 5 } }
};

const ueData = {
  labels: ['Informatique', 'Mathématiques', 'Langues', 'Management', 'Sciences'],
  datasets: [{
    data: [35, 20, 15, 20, 10],
    backgroundColor: ['#7c3aed', '#c084fc', '#fb7185', '#fbbf24', '#2dd4bf'],
    borderWidth: 0,
    cutout: '75%'
  }]
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10, weight: '600' } } }
  }
};

const recentEvaluations = [
  { id: 1, title: 'POO Java', ue: 'UE Info', responses: 45, score: 4.2 },
  { id: 2, title: 'Analyse', ue: 'UE Maths', responses: 38, score: 3.9 },
  { id: 3, title: 'Anglais', ue: 'UE Langues', responses: 50, score: 4.5 },
  { id: 4, title: 'Gestion Projet', ue: 'UE Management', responses: 42, score: 4.0 },
];
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Section des filtres */
.filters-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 900;
  color: #5f527a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.filter-select {
  width: 100%;
  padding: 0.625rem;
  background-color: #f8f7fa;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1c0845;
  outline: none;
  transition: all 0.3s ease;
}

.filter-select:focus {
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.filter-reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: #5f527a;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-reset-btn:hover {
  background-color: #f3f4f6;
}

.filter-reset-btn:active {
  transform: scale(0.95);
}

/* Grille des statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Section des graphiques */
.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-card {
  background-color: white;
  padding: 2rem;
  border-radius: 2rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.chart-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1c0845;
  margin-bottom: 1.5rem;
}

.chart-container {
  height: 16rem;
}

/* Section des évaluations */
.evaluations-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .evaluations-section {
    grid-template-columns: 1fr 2fr;
  }
}

.evaluation-doughnut {
  background-color: white;
  padding: 2rem;
  border-radius: 2rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
}

.doughnut-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.evaluation-list {
  background-color: white;
  padding: 2rem;
  border-radius: 2rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.evaluation-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-all-btn {
  color: #2f0d73;
  font-size: 0.875rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  transform: translateX(0.25rem);
}

.evaluations-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.evaluation-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.evaluation-item:hover {
  border-color: rgba(228, 224, 235, 0.5);
  background-color: #f8f7fa;
}

.evaluation-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.evaluation-icon {
  width: 3rem;
  height: 3rem;
  background-color: white;
  border: 1px solid rgba(228, 224, 235, 0.5);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f0d73;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.evaluation-item:hover .evaluation-icon {
  background-color: #2f0d73;
  color: white;
}

.evaluation-info {
  flex: 1;
}

.evaluation-title {
  font-size: 0.875rem;
  font-weight: bold;
  color: #1c0845;
}

.evaluation-ue {
  font-size: 0.75rem;
  color: #5f527a;
}

.evaluation-stats {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-responses {
  display: none;
  text-align: right;
}

@media (min-width: 640px) {
  .stat-responses {
    display: block;
  }
}

.stat-value {
  font-size: 0.875rem;
  font-weight: bold;
  color: #1c0845;
}

.stat-label {
  font-size: 0.625rem;
  color: #5f527a;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: -0.025em;
}

.stat-score-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-score {
  text-align: right;
}

.score-value {
  font-size: 0.875rem;
  font-weight: 900;
  color: #1c0845;
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
}

.score-max {
  font-size: 0.625rem;
  color: #5f527a;
  font-weight: normal;
}

.progress-ring {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #e4e0eb;
  stroke-width: 4;
}

.ring-progress {
  fill: none;
  stroke: #2dd4bf;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 113;
  stroke-dashoffset: calc(113 - (113 * var(--progress, 0) / 100));
  transition: stroke-dashoffset 0.3s ease;
}

.ring-percentage {
  position: absolute;
  font-size: 0.5rem;
  font-weight: 900;
  color: #1c0845;
}
</style>