<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <TheSidebar activePage="Mes Résultats & Stats" />
    
    <main class="ml-64 p-12">
      <button @click="router.push('/stats')" class="text-sm text-[#5f527a] mb-6 flex items-center gap-2 hover:text-[#7c3aed] transition-colors">
        ← Retour aux semestres
      </button>
      
      <div class="mb-10">
        <h1 class="text-[32px] font-bold text-[#1c0845] mb-2 flex items-center gap-3">
          <BarChart3 class="w-8 h-8 text-[#2f0d73]" />
          Semestre {{ route.params.id }}
        </h1>
        <p class="text-[#5f527a] text-sm font-medium">Consultez vos résultats anonymes et comparez-vous à la moyenne de la promotion</p>
      </div>
      
      <div class="space-y-4 max-w-5xl">
        <div v-for="sub in subjects" :key="sub.id" 
             class="bg-white p-6 rounded-[25px] border border-[#e4e0eb66] shadow-sm flex items-center justify-between hover:border-[#7c3aed]/30 transition-all">
          
          <div class="flex items-center gap-5">
            <component :is="sub.accessible ? Eye : EyeOff" 
                       :class="sub.accessible ? 'text-[#7c3aed]' : 'text-gray-400'" 
                       class="w-6 h-6" />
            <div>
              <h4 class="text-lg font-bold text-[#1c0845]">{{ sub.name }}</h4>
              <p class="text-xs text-[#5f527a] font-bold uppercase tracking-wider">{{ sub.type }} • {{ sub.teacher }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-8">
            <div class="flex gap-1.5" v-if="sub.accessible">
              <span v-for="i in 3" :key="i" class="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
            </div>
            
            <div v-if="!sub.accessible" class="flex items-center gap-2 text-gray-400">
              <Lock class="w-3.5 h-3.5" />
              <p class="text-[11px] font-bold italic uppercase">{{ sub.status }}</p>
            </div>

            <button v-if="sub.accessible" @click="router.push(`/stats/detail/${sub.id}`)" 
        class="text-[#2f0d73] font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-1">
  Voir stats →
</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TheSidebar from '../../components/student/TheSidebar.vue';
import { Eye, EyeOff, BarChart3, Lock } from 'lucide-vue-next';

const router = useRouter(); 
const route = useRoute();   

const subjects = [
  { id: 1, name: "Statistiques Avancées", type: "Fondamentaux", teacher: "Mme. Dupont", accessible: true },
  { id: 2, name: "Base de Données", type: "Informatique", teacher: "M. Leroy", accessible: false, status: "Vous n'avez pas encore répondu" }
];
</script>