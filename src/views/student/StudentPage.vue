<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <TheSidebar activePage="Accueil" @collapse="sidebarCollapsed = $event" />

    <main
      :class="sidebarCollapsed ? 'ml-[72px]' : 'ml-64'"
      class="p-12 transition-all duration-250"
    >
      <div class="flex justify-between items-start mb-10">
        <div class="ml-4">
          <h1 class="text-3xl font-bold text-[#1c0845] mb-1">Bonjour, Étudiant 👋</h1>
          <p class="text-[#5f527a] font-medium text-sm">FIE 3 • École d'ingénieurs ISIS</p>
          
          <div class="flex items-center gap-2 mt-4 text-[#7c3aed] text-xs font-bold bg-purple-50 w-fit px-3 py-1 rounded-full">
            <Home class="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#e4e0eb66] shadow-sm">
          <div class="w-8 h-8 rounded-full bg-[#2f0d73] flex items-center justify-center text-white text-[10px] font-bold">
            JD
          </div>
          <span class="text-sm text-[#5f527a] font-semibold">jean.dupont@etud.univ-jfc.fr</span>
        </div>
      </div>

      <div class="flex justify-center mb-12">
        <div class="bg-white p-6 rounded-[32px] border border-[#e4e0eb66] shadow-sm flex items-center gap-6 w-fit px-12 group hover:border-[#7c3aed] transition-colors">
          <div class="bg-[#f2f1f4] p-4 rounded-2xl group-hover:bg-purple-50 transition-colors">
            <Calendar class="h-8 w-8 text-[#1c0845] group-hover:text-[#7c3aed]" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-[#1c0845]">2025–2026</h2>
            <p class="text-[#5f527a] text-sm font-bold uppercase tracking-widest opacity-60">Année académique</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div v-for="sem in semesterData" :key="sem.id" 
             @click="goToSemester(sem.routeId)"
             class="bg-white p-8 rounded-[45px] border border-[#e4e0eb66] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          
          <div :class="['absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-150', sem.active ? 'bg-[#2f0d73]' : 'bg-gray-400']"></div>

          <div class="flex justify-between items-start mb-8">
            <div :class="['w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-xl shadow-lg transition-all group-hover:rotate-6', sem.active ? 'bg-gradient-to-br from-[#2f0d73] to-[#7c3aed]' : 'bg-[#9ca3af]']">
              {{ sem.id }}
            </div>
            <div class="p-2 rounded-full bg-gray-50 group-hover:bg-purple-50 group-hover:text-[#7c3aed] transition-colors">
              <ChevronRight class="h-6 w-6 text-[#5f527a] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <h3 class="text-2xl font-bold text-[#1c0845] mb-1">Semestre {{ sem.routeId }}</h3>
          <div class="flex items-center gap-2 text-[#5f527a] text-xs font-bold mb-8">
            <span class="px-2 py-0.5 rounded bg-gray-100 uppercase">FIE3</span>
            <span class="text-gray-300">•</span>
            <span>{{ sem.total }} Modules total</span>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between text-xs font-black uppercase tracking-tighter">
              <span class="text-[#5f527a]">Progression des évaluations</span>
              <span class="text-[#1c0845]">{{ Math.round((sem.progress / sem.total) * 100) }}%</span>
            </div>

            <div class="w-full bg-[#f2f1f4] h-3 rounded-full overflow-hidden border border-gray-50">
              <div :class="['h-full rounded-full transition-all duration-1000 ease-out shadow-sm', sem.active ? 'bg-gradient-to-r from-[#2f0d73] to-[#7c3aed]' : 'bg-gray-300']" 
                   :style="{ width: (sem.progress / sem.total) * 100 + '%' }"></div>
            </div>
            <p class="text-[10px] text-[#5f527a] font-medium">{{ sem.progress }} modules complétés sur {{ sem.total }}</p>
          </div>

          <div v-if="sem.active" class="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Session Ouverte
          </div>
          <div v-else class="mt-6 inline-flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
            Bientôt disponible
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheSidebar from '../../components/student/TheSidebar.vue';
import { Home, ChevronRight, Calendar } from "lucide-vue-next";

const router = useRouter();
const sidebarCollapsed = ref(false);
const semesterData = [
  { id: 'S5', routeId: 5, title: "Semestre 5", progress: 3, total: 9, active: true },
  { id: 'S6', routeId: 6, title: "Semestre 6", progress: 0, total: 4, active: false },
];

const goToSemester = (id) => {
  router.push(`/semestre/${id}`);
};


</script>

<style scoped>
/* Animation d'entrée pour les cartes */
.grid > div {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }

@keyframes slideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
