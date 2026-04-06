<template>
  <div class="w-full lg:w-[400px] bg-white p-8 rounded-[40px] border border-[#e4e0eb66] shadow-xl shadow-gray-100/50 self-start">
    <div class="flex items-center gap-3 mb-2">
      <Star class="w-6 h-6 text-[#ff6b6b]" fill="#ff6b6b" />
      <h3 class="text-xl font-bold text-[#1c0845]">Mes Récompenses</h3>
    </div>
    <p class="text-xs text-[#5f527a] mb-8 leading-relaxed font-medium">Gagnez des crédits en participant aux évaluations</p>

    <div class="bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] p-7 rounded-[35px] text-white mb-8 relative overflow-hidden shadow-lg shadow-purple-200">
      <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner">
          <Award class="w-8 h-8 text-white" />
        </div>
        <div>
          <p class="text-[10px] opacity-90 uppercase font-black tracking-widest mb-1">Niveau actuel</p>
          <p class="text-2xl font-bold uppercase tracking-tight leading-tight">{{ levelName }}</p>
        </div>
      </div>
      <p class="text-[11px] mt-6 opacity-80 font-medium">Vos premiers pas dans l'amélioration continue</p>
    </div>

    <div class="bg-[#fcfbfc] p-6 rounded-[30px] flex justify-around items-center mb-8 border border-[#f0f0f5]">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <p :class="['text-2xl font-black', stat.color]">{{ stat.value }}</p>
        <p class="text-[10px] text-[#5f527a]/60 uppercase font-black tracking-tighter">{{ stat.label }}</p>
      </div>
    </div>

    <div class="space-y-4 px-2">
      <div class="flex justify-between items-center text-[11px] font-black uppercase">
        <span class="flex items-center gap-2 text-[#5f527a]">
          <TrendingUp class="w-4 h-4 text-[#8b5cf6]" /> Prochain niveau
        </span>
        <span class="text-[#1c0845]">{{ nextLevel }}</span>
      </div>
      <div class="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden border border-gray-50">
        <div class="bg-gradient-to-r from-[#6366f1] to-[#d946ef] h-full rounded-full transition-all duration-1000" :style="{ width: xpProgress + '%' }"></div>
      </div>
      <p class="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ creditsNeeded }} crédits restants</p>
    </div>
  </div>
</template>

<script setup>
import { Star, Award, TrendingUp } from 'lucide-vue-next';
defineProps({
  levelName: String,
  nextLevel: String,
  xpProgress: Number,
  creditsNeeded: Number,
  stats: Array
});
</script>