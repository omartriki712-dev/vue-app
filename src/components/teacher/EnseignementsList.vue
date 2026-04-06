<!-- EnseignementList.vue -->
<template>
  <section class="ue-list">
    <h2 class="title">Enseignements – {{ promoName }}</h2>
    <EnseignementCard v-for="ue in ues" :key="ue.id" :ue="ue" @click="emit('ue-select', ue)" />
  </section>
</template>

<script setup lang="ts">
import EnseignementCard from './EnseignementCard.vue'

type UE = {
  id: number
  code: string
  title: string
  subtitle: string
  progress: number
  completed?: number
  total?: number
  matieres?: number
  icon?: 'book' | 'code' | 'translate' | 'people'
  status?: 'en-cours' | 'planifie' | 'a-planifier'
}

defineProps<{
  promoName?: string
  ues: UE[]
}>()

const emit = defineEmits<{
  'ue-select': [ue: UE]
}>()
</script>

<style scoped>
.ue-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
}

.title {
  margin: 16px 0 8px;
  color: #20174f;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}
</style>
