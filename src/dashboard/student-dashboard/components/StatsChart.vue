<template>
  <div class="h-64">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const props = defineProps(['data']);
const chartData = {
  labels: ['Clarté', 'Qualité TDs', 'Supports', 'Charge', 'Note globale'],
  datasets: [
    { label: 'Vos réponses', data: props.data.yours, backgroundColor: '#1c0845' },
    { label: 'Moyenne promotion', data: props.data.average, backgroundColor: '#c7d2fe' }
  ]
};
const options = { indexAxis: 'y', responsive: true, maintainAspectRatio: false };
</script>