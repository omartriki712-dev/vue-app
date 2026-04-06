<template>
  <button @click="router.back()" class="text-sm text-[#5f527a] mb-6 flex items-center gap-2 hover:text-[#7c3aed] transition-colors">
    ← Retour aux matières
  </button>

  <div class="mb-8">
    <h1 class="text-[32px] font-bold text-[#1c0845] mb-1 flex items-center gap-3">
      <BarChart3 class="w-8 h-8 text-[#2f0d73]" />
      Mes Résultats & Stats
    </h1>
    <p class="text-[#5f527a] text-sm font-medium">Consultez vos résultats anonymes et comparez-vous à la moyenne de la promotion</p>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-bold text-[#1c0845]">Statistiques Avancées</h2>
    <p class="text-sm text-[#5f527a] font-bold uppercase tracking-wider">Mme. Dupont • STA501</p>
  </div>

  <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-8 flex items-start gap-3">
    <ShieldCheck class="w-6 h-6 text-[#2f0d73] mt-0.5" />
    <div>
      <h4 class="text-sm font-bold text-[#1c0845]">Données anonymisées</h4>
      <p class="text-xs text-[#5f527a]">Les résultats sont agrégés. Votre positionnement est comparé à la moyenne de la promotion sans identifier aucun répondant.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div class="bg-white p-8 rounded-[35px] border border-[#e4e0eb66] shadow-sm">
      <h3 class="font-bold text-[#1c0845] mb-6 flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-[#2f0d73]" /> Comparaison par question
      </h3>
      <StatsChart :data="{ yours: [4, 4, 4, 3, 4], average: [3, 3, 4, 3, 4] }" />
    </div>

    <div class="bg-white p-8 rounded-[35px] border border-[#e4e0eb66] shadow-sm">
      <h3 class="font-bold text-[#1c0845] mb-6 flex items-center gap-2">
        <UserCircle class="w-5 h-5 text-[#2f0d73]" /> Profil comparatif
      </h3>
      <RadarChart :data="{ yours: [4, 5, 3, 4, 4], average: [3, 4, 3, 3, 3] }" />
    </div>
  </div>

  <div class="flex gap-8 mt-8 justify-center">
    <div class="flex items-center gap-2 text-sm font-bold text-[#1c0845]">
      <span class="w-3 h-3 rounded-full bg-[#2f0d73]"></span> Vos réponses
    </div>
    <div class="flex items-center gap-2 text-sm font-bold text-[#5f527a]">
      <span class="w-3 h-3 rounded-full bg-gray-400"></span> Moyenne promotion
    </div>
  </div>
</template>

<script setup>
import StatsChart from '../components/StatsChart.vue';
import RadarChart from '../components/RadarChart.vue';
import { BarChart3, ShieldCheck, TrendingUp, UserCircle } from 'lucide-vue-next';
import {useRouter} from "vue-router";
const router = useRouter();
</script>
