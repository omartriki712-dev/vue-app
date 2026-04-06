<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <TheSidebar activePage="Historique" />

    <main class="ml-64 p-12">
      <div class="mb-8 ml-4">
        <h1 class="text-[32px] font-bold text-[#1c0845]">Bonjour, Étudiant 👋</h1>
        <p class="text-[#5f527a] text-sm font-medium">FIE 3 • Semestre 5</p>
      </div>

      <div class="ml-4 mb-10 flex items-center gap-2 text-sm text-[#5f527a]">
        <Home class="w-4 h-4 cursor-pointer hover:text-[#8b5cf6]" @click="$router.push('/student')" />
        <ChevronRight class="w-3 h-3 opacity-50" />
        <span>Accueil</span>
      </div>

      <h2 class="ml-4 text-xl font-bold text-[#1c0845] mb-8">Sélectionnez un semestre</h2>

      <div class="flex flex-col lg:flex-row gap-10">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 flex-grow">
          <div v-for="i in 10" :key="i" 
               @click="i === 5 ? $router.push('/modules') : null"
               :class="[
                 'bg-white p-6 rounded-[30px] border border-[#e4e0eb66] shadow-sm relative group transition-all',
                 i === 5 ? 'cursor-pointer hover:border-[#8b5cf6] hover:shadow-md' : 'cursor-not-allowed opacity-80'
               ]">
            
            <div class="flex justify-between items-start mb-6">
              <span class="text-2xl font-bold text-[#1c0845]">S{{ i }}</span>
              <Lock v-if="i !== 5" class="w-4 h-4 text-gray-300" />
              <ChevronRight v-else class="w-4 h-4 text-[#8b5cf6] group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div>
              <p class="text-sm font-bold text-[#1c0845] mb-1">Semestre {{ i }}</p>
              <p class="text-[10px] text-gray-400 font-medium uppercase">FIE{{ Math.ceil(i/2) }}</p>
            </div>

            <div v-if="i === 5" class="mt-4">
               <div class="flex justify-between text-[10px] font-bold mb-1">
                 <span class="text-[#8b5cf6]">Progression</span>
                 <span>3/9</span>
               </div>
               <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                 <div class="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-full w-[33%]"></div>
               </div>
               <div class="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#eefdf5] text-[#22c55e] rounded-full text-[10px] font-bold">
                 <div class="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></div>
                 Actif
               </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-[400px] bg-white p-8 rounded-[40px] border border-[#e4e0eb66] shadow-xl shadow-gray-100/50 self-start">
          <div class="flex items-center gap-3 mb-2">
            <Star class="w-6 h-6 text-[#ff6b6b]" fill="#ff6b6b" />
            <h3 class="text-xl font-bold text-[#1c0845]">Mes Récompenses</h3>
          </div>
          <p class="text-xs text-[#5f527a] mb-8 leading-relaxed font-medium">Gagnez des crédits en participant aux évaluations</p>

          <div class="bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] p-7 rounded-[35px] text-white mb-8 relative overflow-hidden shadow-lg shadow-purple-200">
             <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
             <div class="absolute top-1/2 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             
             <div class="relative z-10 flex items-center gap-4">
               <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner">
                 <Award class="w-8 h-8 text-white" />
               </div>
               <div>
                 <p class="text-[10px] opacity-90 uppercase font-black tracking-widest mb-1">Niveau actuel</p>
                 <p class="text-2xl font-bold uppercase tracking-tight leading-tight">Contributeur <br/> Bronze</p>
               </div>
             </div>
             <p class="text-[11px] mt-6 opacity-80 font-medium leading-normal">Vos premiers pas dans l'amélioration continue</p>
          </div>

          <div class="bg-[#fcfbfc] p-6 rounded-[30px] flex justify-around items-center mb-8 border border-[#f0f0f5]">
            <div class="text-center">
              <p class="text-2xl font-black text-[#a78bfa]">0</p>
              <p class="text-[10px] text-[#5f527a]/60 uppercase font-black tracking-tighter">Crédits</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-black text-[#a78bfa]">0</p>
              <p class="text-[10px] text-[#5f527a]/60 uppercase font-black tracking-tighter">Évaluations</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-black text-[#4f46e5]">+5</p>
              <p class="text-[10px] text-[#5f527a]/60 uppercase font-black tracking-tighter">Par éval.</p>
            </div>
          </div>

          <div class="space-y-4 px-2">
            <div class="flex justify-between items-center text-[11px] font-black uppercase">
              <span class="flex items-center gap-2 text-[#5f527a]">
                <TrendingUp class="w-4 h-4 text-[#8b5cf6]" /> Prochain niveau
              </span>
              <span class="text-[#1c0845]">Évaluateur Argent</span>
            </div>
            <div class="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden border border-gray-50">
               <div class="bg-gradient-to-r from-[#6366f1] to-[#d946ef] h-full w-[15%] rounded-full shadow-sm"></div>
            </div>
            <p class="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">25 crédits restants</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TheSidebar from '../../components/student/TheSidebar.vue';
import { Home, Lock, ChevronRight, Star, Award, TrendingUp } from 'lucide-vue-next';

const router = useRouter();
</script>
