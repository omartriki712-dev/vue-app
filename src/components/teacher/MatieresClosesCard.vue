<template>
  <div class="card">
    <div class="card-title">
      <!-- Book icon -->
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      <span>Matières enseignées</span>
    </div>

    <p class="subtitle">Matières dont l'évaluation est close</p>

    <ul class="list">
      <MatiereCloseRow
        v-for="m in matieres"
        :key="m.code"
        :matiere="m"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import MatiereCloseRow from './MatiereCloseRow.vue'

export interface MatiereClose {
  nom: string
  code: string
  promotion: string
  nbReponses: number
  year?: number
}

defineProps<{
  matieres: MatiereClose[]
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
  margin: 0 0 8px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
