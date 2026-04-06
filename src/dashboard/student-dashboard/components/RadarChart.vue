<template>
  <div class="h-64">
    <Radar :data="chartData" :options="{ responsive: true, maintainAspectRatio: false }" />
  </div>
</template>

<script setup>
import { Radar } from 'vue-chartjs';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);
const props = defineProps(['data']);
const chartData = {
  labels: ['Clarté', 'Supports', 'Interactivité', 'Charge', 'Satisfaction'],
  datasets: [
    { label: 'Vos réponses', data: props.data.yours, backgroundColor: 'rgba(124, 58, 237, 0.2)', borderColor: '#7c3aed' },
    { label: 'Moyenne promotion', data: props.data.average, backgroundColor: 'rgba(156, 163, 175, 0.2)', borderColor: '#9ca3af' }
  ]
};
</script>