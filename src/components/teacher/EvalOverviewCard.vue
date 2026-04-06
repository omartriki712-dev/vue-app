<template>
  <div class="card">
    <div class="card-title">
      <!-- Bar chart icon -->
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
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
      <span>Aperçu des évaluations</span>
    </div>

    <p class="subtitle">Sur les matières dont l'évaluation est close</p>

    <div class="stats">
      <div class="stat-box">
        <span class="stat-value">{{ nbMatieres }}</span>
        <span class="stat-label">Matières</span>
      </div>
      <div class="divider" />
      <div class="stat-box">
        <span class="stat-value">{{ totalReponses }}</span>
        <span class="stat-label">Réponses totales</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  nbMatieres: number
  totalReponses: number
}>()
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #eceaf5;
  border-radius: 16px;
  padding: 22px 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4e3cb2;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 12px;
  color: #9893b0;
  margin: 0 0 20px;
}

.stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: #f7f6fb;
  border-radius: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e1848;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #7b7698;
}

.divider {
  width: 1px;
  height: 40px;
  background: #eceaf5;
}
</style>
