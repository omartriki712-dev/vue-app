<template>
  <section>
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <SemesterCard v-for="semester in semesters" :key="semester.id" :semester="semester" :year="startYear" :promo="promoId" />
    </div>
  </section>
</template>

<script setup lang="ts">
import SemesterCard from './SemesterCard.vue'

withDefaults(
  defineProps<{
    startYear: number
    endYear: number
    semesters: Array<{
      id: number
      label: string
      title: string
      completed: number
      total: number
      progress: number
    }>
    columns?: number
    titleSuffix?: string
    promoId?: string
  }>(),
  { columns: 5 },
)
</script>

<style scoped>
.title {
  margin: 18px 0 24px;
  color: #20174f;
  font-size: 32px;
  line-height: 1.15;
}

.grid {
  display: grid;
  gap: 16px;
}

@media (max-width: 1000px) {
  .title {
    font-size: 28px;
  }
}

@media (max-width: 760px) {
  .title {
    font-size: 24px;
    margin: 16px 0 18px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }
}
</style>
