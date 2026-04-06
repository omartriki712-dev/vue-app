<template>
  <section>
    <h2 class="title">Sélectionnez une année académique</h2>

    <div class="grid">
      <button
        v-for="year in years"
        :key="year.id"
        class="year-button"
        type="button"
        @click="handleYearClick(year.start)"
      >
        <AnneeAcademique :start-year="year.start" :end-year="year.end" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AnneeAcademique from './AnneeAcademique.vue'

const router = useRouter()

const emit = defineEmits<{
  yearSelect: [year: number]
}>()

defineProps<{
  years: Array<{
    id: number
    start: number
    end: number
  }>
}>()

function handleYearClick(year: number) {
  emit('yearSelect', year)

  router.push({
    name: 'Filiere',
    query: { year },
  })
}
</script>

<style scoped>
.title {
  margin: 18px 0 14px;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 16px;
}

.year-button {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.year-button:hover {
  transform: translateY(-4px);
}

.year-button:active {
  transform: translateY(-2px);
}

.grid :deep(.academic-year-card) {
  width: 100%;
  min-height: 78px;
}

@media (max-width: 1200px) {
  .title {
    font-size: 20px;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 760px) {
  .title {
    font-size: 18px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
