<!-- components/QuestionScoreChart.vue -->
<template>
  <div class="chart-card">
    <h3 class="chart-title">Résultats par question</h3>
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

export interface QuestionResult {
  label: string
  moyenne: number
}

const props = defineProps<{ questions: QuestionResult[] }>()

// 64px par barre + marges
const chartHeight = computed(() => Math.max(320, props.questions.length * 64 + 60))

const series = computed(() => [
  {
    name: 'Note moyenne',
    data: props.questions.map((q) => parseFloat(q.moyenne.toFixed(2))),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    toolbar: { show: false },
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '55%',
      dataLabels: { position: 'center' },
    },
  },
  colors: ['#5b4fcf'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '12px', fontWeight: 700, colors: ['#fff'] },
    formatter: (val: number) => val.toFixed(2),
  },
  // Les catégories (questions complètes) vont dans xaxis pour les barres horizontales
  xaxis: {
    categories: props.questions.map((q) => q.label),
    min: 0,
    max: 4,
    tickAmount: 4,
    labels: {
      style: { fontSize: '11px', colors: '#8d88a4' },
    },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#4a4270' },
      maxWidth: 380,
    },
  },
  grid: {
    borderColor: '#edeaf7',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  tooltip: {
    x: { show: true },
    y: { formatter: (val: number) => `${val.toFixed(2)} / 4` },
  },
}))
</script>

<style scoped>
.chart-card {
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 16px;
  padding: 22px 20px 8px;
}

.chart-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1e1848;
}
</style>
