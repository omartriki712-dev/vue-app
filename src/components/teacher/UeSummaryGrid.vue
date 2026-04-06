<!-- components/UeSummaryGrid.vue -->
<template>
  <div class="ue-summary-grid">
    <!-- Progression -->
    <div class="summary-card">
      <span class="summary-label">Progression</span>
      <div class="summary-progress-row">
        <div class="bar">
          <span class="fill" :style="{ width: `${progress}%` }" />
        </div>
        <span class="summary-value">{{ progress }}%</span>
      </div>
    </div>

    <!-- Évaluations reçues -->
    <div class="summary-card" v-if="completed != null && total">
      <span class="summary-label">Évaluations reçues</span>
      <span class="summary-value big">
        {{ completed }}<span class="summary-total">/{{ total }}</span>
      </span>
    </div>

    <!-- Code enseignement -->
    <div class="summary-card">
      <span class="summary-label">Code enseignement</span>
      <span class="summary-value code">{{ code }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
  completed?: number | null
  total?: number | null
  code: string
}>()
</script>

<style scoped>
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

@media (max-width: 760px) {
  .ue-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .ue-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
