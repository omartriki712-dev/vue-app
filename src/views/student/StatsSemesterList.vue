<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <TheSidebar activePage="Mes Résultats & Stats" />
    
    <main class="ml-64 p-12">
      <div class="mb-10 ml-4">
        <h1 class="text-[32px] font-bold text-[#1c0845] mb-2 flex items-center gap-3">
          <BarChart3 class="w-8 h-8 text-[#2f0d73]" />
          Mes Résultats & Stats
        </h1>
        <p class="text-[#5f527a] text-sm font-medium">Consultez vos résultats anonymes par semestre.</p>
      </div>

      <div class="space-y-4 max-w-3xl">
        <div v-for="sem in [5, 6]" :key="sem" 
             @click="router.push(`/stats/semester/${sem}`)"
             class="bg-white p-8 rounded-[35px] border border-[#e4e0eb66] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#7c3aed] transition-all hover:shadow-md">
          <div>
            <h3 class="text-xl font-bold text-[#1c0845]">Semestre {{ sem }}</h3>
            <p class="text-sm text-[#5f527a]">FIE3 • 2025–2026</p>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full text-[#5f527a]">
            <Lock class="w-3 h-3" /> {{ sem === 5 ? '4/9' : '0/4' }} disponibles
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TheSidebar from '../../components/student/TheSidebar.vue';
import { Lock, BarChart3 } from "lucide-vue-next";

const router = useRouter();
</script>