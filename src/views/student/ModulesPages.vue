<template>
  <div class="relative min-h-screen bg-[#fcfcfc] font-jakarta">
    <TheSidebar activePage="Accueil" />

    <main class="ml-64 p-12">
      <div class="mb-6 ml-4">
        <h1 class="text-[28px] font-bold text-[#1c0845]">Bonjour, Étudiant 👋</h1>
        <p class="text-[#5f527a] text-xs font-semibold tracking-widest uppercase opacity-70">FIE 3 • Semestre {{ selectedSemester }}</p>
      </div>

      <div class="ml-4 mb-8 flex items-center gap-2 text-[13px] text-[#5f527a]">
        <Home class="w-4 h-4 cursor-pointer hover:text-[#7c3aed] transition-colors" @click="$router.push('/student')" />
        <ChevronRight class="w-3 h-3 opacity-40" />
        <span class="cursor-pointer hover:text-[#7c3aed]" @click="$router.push('/student')">Accueil</span>
        <ChevronRight class="w-3 h-3 opacity-40" />
        <span class="font-bold text-[#7c3aed]">Semestre {{ selectedSemester }}</span>
      </div>

      <h2 class="ml-4 text-lg font-bold text-[#1c0845] mb-6">Unités d'enseignement</h2>

      <div class="module-list max-w-4xl ml-4 space-y-4">
        <div v-for="ue in filteredModules" :key="ue.id" 
             @click="goToModule(ue.id)"
             class="module-card bg-white p-5 rounded-[24px] border border-[#e4e0eb66] shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[110px]">
          
          <div class="card-header flex items-center justify-between">
            <div class="card-main flex items-center gap-5 flex-grow">
              <div class="module-icon w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#d946ef]">
                <component :is="ue.icon" class="w-6 h-6" />
              </div>

              <div class="card-text flex-grow">
                <p class="module-code text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.15em] mb-0.5">{{ ue.code }}</p>
                <h3 class="module-title text-lg font-bold text-[#1c0845] group-hover:text-[#7c3aed] transition-colors">{{ ue.title }}</h3>
                <p class="module-desc text-xs text-[#5f527a]/60 font-medium">{{ ue.description }}</p>
              </div>
            </div>
            
            <div class="card-right flex flex-col items-end gap-2 min-w-[120px]">
               <div class="ratio-row flex items-center gap-2">
                 <span class="ratio-text text-[11px] font-bold text-[#1c0845]">{{ Math.round((ue.validated / ue.total) * 100) }}%</span>
                 <ChevronRight class="ratio-arrow w-4 h-4 text-[#1c0845]/20 group-hover:text-[#7c3aed] group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </div>

          <div class="card-progress mt-4">
            <div class="progress-meta flex justify-between text-[9px] font-black uppercase tracking-widest text-[#5f527a]/50 mb-1.5">
              <span>{{ ue.validated }} / {{ ue.total }} matières</span>
            </div>
            <div class="progress-track w-full bg-[#f3f4f6] h-1.5 rounded-full overflow-hidden">
              <div :style="{ width: (ue.validated / ue.total) * 100 + '%' }"
                   class="progress-fill h-full rounded-full bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#d946ef] transition-all duration-1000 shadow-[0_0_8px_rgba(124,58,237,0.3)]">
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheSidebar from '../../components/student/TheSidebar.vue';
import { Home, ChevronRight, BookText, Terminal, Code, Users2, Brain, BarChart3 } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter(); // Initialize router for navigation
const selectedSemester = computed(() => parseInt(route.params.id) || 5);

// Navigation logic
const goToModule = (id) => {
  router.push({ name: 'ModuleEvaluation', params: { id: id } });
};

const allModules = [
  { id: 1, semester: 5, code: 'UE501', title: 'Fondamentaux', description: 'Mathématiques et sciences de base', icon: BookText, validated: 1, total: 2 },
  { id: 2, semester: 5, code: 'UE502', title: 'Informatique', description: 'Développement logiciel et systèmes', icon: Terminal, validated: 1, total: 3 },
  { id: 3, semester: 5, code: 'UE503', title: 'Langues & Communication', description: 'Anglais technique et soft skills', icon: Brain, validated: 1, total: 2 },
  { id: 4, semester: 5, code: 'UE504', title: 'Management & Projet', description: 'Gestion de projet et méthodologies', icon: BarChart3, validated: 0, total: 2 },
  { id: 5, semester: 6, code: 'UE601', title: 'Génie Logiciel', description: 'Architecture et design patterns', icon: Code, validated: 0, total: 4 },
  { id: 6, semester: 6, code: 'UE602', title: 'Réseaux Avancés', description: 'Protocoles et sécurité', icon: Users2, validated: 2, total: 3 },
  { id: 7, semester: 6, code: 'UE603', title: 'Intelligence Artificielle', description: 'Machine Learning et Data Science', icon: Brain, validated: 0, total: 3 },
  { id: 8, semester: 6, code: 'UE604', title: 'Stage Technique', description: 'Immersion en milieu professionnel', icon: BarChart3, validated: 0, total: 1 },
];

const filteredModules = computed(() => {
  return allModules.filter(m => m.semester === selectedSemester.value);
});
</script>

<style scoped>
.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.module-list .module-card {
  border: 1px solid #f0eef8;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(18, 14, 58, 0.07);
  padding: 18px 20px 14px;
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.module-list .module-card:hover {
  box-shadow: 0 8px 28px rgba(18, 14, 58, 0.12);
  transform: translateY(-2px);
}

.module-list .module-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #ece9f8;
  color: #4e3cb2;
  box-shadow: none;
}

.module-list .module-code {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #5b4fcf;
  background: #eeebfa;
  border-radius: 6px;
  padding: 2px 7px;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.module-list .module-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: #1e1848;
}

.module-list .module-desc {
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #8c89a4;
}

.module-list .ratio-text {
  font-size: 13px;
  font-weight: 600;
  color: #282143;
}

.module-list .ratio-arrow {
  color: #9893b0;
}

.module-list .progress-meta {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: #a09cb8;
}

.module-list .progress-track {
  height: 5px;
  background: #e9e8f0;
}

.module-list .progress-fill {
  background: #40248d;
  box-shadow: none;
}

.group {
  animation: slideUp 0.4s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .module-list .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .module-list .card-right {
    width: 100%;
    align-items: flex-start;
  }
}
</style>
