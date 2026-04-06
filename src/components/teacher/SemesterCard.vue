<template>
  <div
    @click="handleClick"
    @keydown.enter="handleClick"
    role="button"
    tabindex="0"
    class="bg-white p-8 rounded-[45px] border border-[#e4e0eb66] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden"
  >
    <!-- Decorative circle -->
    <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 bg-[#2f0d73] transition-transform group-hover:scale-150"></div>

    <!-- Top row: badge + chevron -->
    <div class="flex justify-between items-start mb-8">
      <div class="w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-xl shadow-lg bg-gradient-to-br from-[#2f0d73] to-[#7c3aed] transition-all group-hover:rotate-6">
        {{ semester.label }}
      </div>
      <div class="p-2 rounded-full bg-gray-50 group-hover:bg-purple-50 transition-colors">
        <ChevronRight class="h-6 w-6 text-[#5f527a] group-hover:translate-x-1 group-hover:text-[#7c3aed] transition-transform" />
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-2xl font-bold text-[#1c0845] mb-1">{{ semester.title }}</h3>

    <!-- Promo + enseignements -->
    <div class="flex items-center gap-2 text-[#5f527a] text-xs font-bold">
      <span v-if="promo" class="px-2 py-0.5 rounded bg-gray-100 uppercase">{{ promo }}</span>
      <span v-if="promo" class="text-gray-300">•</span>
      <span>{{ semester.total }} enseignement{{ semester.total > 1 ? 's' : '' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()

const props = defineProps<{
  semester: {
    id: number
    label: string
    title: string
    completed: number
    total: number
    progress: number
  }
  year?: number
  promo?: string
}>()

function handleClick() {
  router.push({
    name: 'SemestreEnseignements',
    query: {
      year: props.year ?? 2025,
      semester: props.semester.title,
      promo: props.promo ?? '',
    },
  })
}
</script>
