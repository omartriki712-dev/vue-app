<template>
  <div 
    @click="active ? $emit('select') : null"
    :class="[
      'bg-white p-6 rounded-[30px] border border-[#e4e0eb66] shadow-sm relative group transition-all h-full flex flex-col justify-between',
      active ? 'cursor-pointer hover:border-[#8b5cf6] hover:shadow-md' : 'cursor-not-allowed opacity-80'
    ]"
  >
    <div class="flex justify-between items-start mb-6">
      <span class="text-2xl font-bold text-[#1c0845]">S{{ number }}</span>
      <Lock v-if="!active" class="w-4 h-4 text-gray-300" />
      <ChevronRight v-else class="w-4 h-4 text-[#8b5cf6] group-hover:translate-x-1 transition-transform" />
    </div>
    
    <div>
      <p class="text-sm font-bold text-[#1c0845] mb-1">Semestre {{ number }}</p>
      <p class="text-[10px] text-gray-400 font-medium uppercase">FIE{{ Math.ceil(number/2) }}</p>
    </div>

    <div v-if="active" class="mt-4">
      <div class="flex justify-between text-[10px] font-bold mb-1">
        <span class="text-[#8b5cf6]">Progression</span>
        <span>{{ progress }}/{{ total }}</span>
      </div>
      <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div 
          class="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-full transition-all duration-500" 
          :style="{ width: (progress / total) * 100 + '%' }"
        ></div>
      </div>
      <div class="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#eefdf5] text-[#22c55e] rounded-full text-[10px] font-bold">
        <div class="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></div>
        Actif
      </div>
    </div>
  </div>
</template>

<script setup>
import { Lock, ChevronRight } from 'lucide-vue-next';

// Définition des propriétés attendues
defineProps({
  number: Number,
  active: Boolean,
  progress: { type: Number, default: 0 },
  total: { type: Number, default: 9 }
});

// Définition de l'événement de sélection
defineEmits(['select']);
</script>

<style scoped>
/* Styles spécifiques si besoin */
</style>