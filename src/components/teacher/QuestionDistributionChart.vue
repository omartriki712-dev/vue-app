<!-- components/QuestionDistributionChart.vue -->
<template>
  <div class="chart-card">
    <h3 class="chart-title">Distribution des réponses par question</h3>
    <apexchart
      type="bar"
      :height="chartHeight"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

export interface QuestionDistribution {
  label: string
  /** counts: [toutFait(4), plutotAccord(3), plutotPas(2), pasDuTout(1), neSePrononce(0)] */
  counts: [number, number, number, number, number]
}

const props = defineProps<{
  questions: QuestionDistribution[]
  /** Nombre total d'étudiants attendus (inscrits). */
  totalAttendu: number
}>()

const LABELS = [
  "Tout à fait d'accord",
  "Plutôt d'accord",
  "Plutôt pas d'accord",
  "Pas du tout d'accord",
  'Ne se prononce pas',
]

const COLORS = ['#5b4fcf', '#a78bfa', '#c4b5fd', '#f87171', '#d1d5db']

const chartHeight = computed(() => Math.max(320, props.questions.length * 64 + 60))

const series = computed(() =>
  LABELS.map((name, i) => ({
    name,
    data: props.questions.map((q) => q.counts[i]),
  })),
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    stacked: true,
    toolbar: { show: false },
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '55%',
      borderRadius: 4,
      borderRadiusApplication: 'end' as const,
      borderRadiusWhenStacked: 'last' as const,
    },
  },
  colors: COLORS,
  dataLabels: {
    enabled: true,
    formatter: (val: number) => (val >= 3 ? `${val}` : ''),
    style: { fontSize: '10px', fontWeight: 700, colors: ['#fff'] },
  },
  // ✅ Bonne pratique ApexCharts horizontal :
  // xaxis = axe des VALEURS NUMÉRIQUES (horizontal)
  // categories dans xaxis → affichées automatiquement sur l'axe Y (vertical)
  xaxis: {
    categories: props.questions.map((q) => q.label),
    max: props.totalAttendu,
    tickAmount: 6,
    labels: {
      // Ces labels sont sur l'axe X numérique (valeurs)
      formatter: (val: string) => `${Math.round(Number(val))}`,
      style: { fontSize: '11px', colors: '#8d88a4' },
    },
    title: {
      text: 'Étudiants',
      style: { fontSize: '11px', color: '#9893b0', fontWeight: 500 },
    },
  },
  yaxis: {
    // Axe Y = catégories (questions) — la largeur est contrôlée ici
    labels: {
      style: { fontSize: '11px', colors: '#4a4270' },
      maxWidth: 360,
      // offsetX négatif pour pousser le graphique vers la droite et laisser la place
      offsetX: 0,
    },
  },
  legend: { show: false },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} étudiant${val > 1 ? 's' : ''}`,
    },
  },
  grid: {
    borderColor: '#edeaf7',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  annotations: {
    xaxis: [
      {
        x: props.totalAttendu,
        borderColor: '#b8aee8',
        borderWidth: 1.5,
        strokeDashArray: 5,
        label: {
          text: `Attendu : ${props.totalAttendu}`,
          style: {
            background: '#f0eef9',
            color: '#5b4fcf',
            fontSize: '10px',
            fontWeight: 600,
            padding: { top: 2, bottom: 2, left: 6, right: 6 },
          },
          position: 'top',
          offsetY: 0,
        },
      },
    ],
  },
}))
</script>

<style scoped>
.chart-card {
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 16px;
  padding: 22px 20px 8px;
  /* Donne assez d'espace horizontal au wrapper pour que ApexCharts
     puisse calculer correctement la largeur des labels Y */
  overflow: visible;
}

.chart-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1e1848;
}

/* Force ApexCharts à allouer toute la largeur aux labels Y */
:deep(.apexcharts-yaxis-label) {
  font-size: 11px !important;
  fill: #4a4270 !important;
}

:deep(.apexcharts-yaxis-texts-g) {
  transform: translateX(0) !important;
}
</style>
