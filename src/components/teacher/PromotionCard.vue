<template>
  <button
    type="button"
    @click="emit('click')"
    class="bg-white p-8 rounded-[45px] border border-[#e4e0eb66] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden text-left w-full"
  >
    <!-- Decorative circle -->
    <div :class="['absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-150', variant === 'fia' ? 'bg-[#7a2c10]' : 'bg-[#2f0d73]']"></div>

    <!-- Top row: badge + chevron -->
    <div class="flex justify-between items-start mb-8">
      <div :class="['w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-xl shadow-lg transition-all group-hover:rotate-6', variant === 'fia' ? 'bg-gradient-to-br from-[#7a2c10] to-[#f5b8a0]' : 'bg-gradient-to-br from-[#2f0d73] to-[#7c3aed]']">
        {{ number }}
      </div>
      <div class="p-2 rounded-full bg-gray-50 group-hover:bg-purple-50 transition-colors">
        <ChevronRight class="h-6 w-6 text-[#5f527a] group-hover:translate-x-1 group-hover:text-[#7c3aed] transition-transform" />
      </div>
    </div>

    <!-- Name + description -->
    <h3 class="text-2xl font-bold text-[#1c0845] mb-1">{{ name }}</h3>
    <p class="text-xs font-bold text-[#5f527a]">{{ description }}</p>
  </button>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  number: number
  name: string
  description: string
  variant?: 'fie' | 'fia'
}>()

const emit = defineEmits<{ click: [] }>()
</script>
