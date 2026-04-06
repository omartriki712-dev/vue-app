<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BarChart3, Loader2, Info } from 'lucide-vue-next'; // Removed Eye, EyeOff, Lock as they are not relevant for modules
import { getModules } from "../actions/modules_actions.js"; // Changed from getCourses

const route = useRoute();
const semesterId = route.params.semesterId;

const modules = ref([]); // Changed from subjects
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    // Using getModules with semesterId filter
    const res = await getModules({ semesterId, studentPromotionId: localStorage.getItem('studentPromotionId') }); // Calling getModules
    modules.value = res || []; // Assigning to modules
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <router-link to="/dashboard/student/semesters"
               class="text-sm text-[#5f527a] mb-6 flex items-center gap-2 hover:text-[#7c3aed] transition-colors">
    ← Retour aux semestres
  </router-link>

  <div class="mb-10">
    <h1 class="text-[32px] font-bold text-[#1c0845] mb-2 flex items-center gap-3">
      <BarChart3 class="w-8 h-8 text-[#2f0d73]"/>
      Semestre {{ semesterId }} - Modules
    </h1>
    <p class="text-[#5f527a] text-sm font-medium">Consultez les résultats par Unité d'Enseignement (UE) pour ce semestre.</p>
  </div>

  <div v-if="loading" class="flex flex-col items-center justify-center py-12">
    <Loader2 class="w-10 h-10 text-[#7c3aed] animate-spin mb-4" />
    <p class="text-[#5f527a] font-medium">Chargement des modules...</p>
  </div>

  <div v-else-if="modules.length === 0" class="text-center py-12 bg-white rounded-[25px] border border-[#e4e0eb66]">
    <p class="text-[#5f527a]">Aucun module trouvé pour ce semestre.</p>
  </div>

  <div v-else class="space-y-4 max-w-5xl">
    <div v-for="mod in modules" :key="mod.id"
         class="bg-white p-6 rounded-[25px] border border-[#e4e0eb66] shadow-sm flex items-center justify-between hover:border-[#7c3aed]/30 transition-all">

      <div class="flex items-center gap-5">
        <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7c3aed]">
          <BarChart3 class="w-6 h-6"/>
        </div>
        <div>
          <h4 class="text-lg font-bold text-[#1c0845]">{{ mod.title }}</h4>
          <p class="text-xs text-[#5f527a] font-bold uppercase tracking-wider">UE {{ mod.id }} • {{ mod.numberCourses || 0 }} matières</p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div class="flex flex-col items-end">
            <span class="text-xs font-bold text-[#5f527a] mb-1">Progression Module</span>
            <div class="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] h-full rounded-full"
                     :style="{ width: mod.numberCourses ? (mod.numberCourseValidated / mod.numberCourses * 100) + '%' : '0%' }"></div>
            </div>
        </div>
        <!-- Assuming a route for module-specific stats detail -->
        <router-link :to="`/dashboard/student/stats/detail/${mod.id}`"
                     class="text-[#2f0d73] font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-1">
          Voir stats →
        </router-link>
      </div>
    </div>

    <div class="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
      <Info class="w-5 h-5 text-blue-500 mt-0.5" />
      <p class="text-xs text-blue-700 leading-relaxed">
        Les statistiques détaillées par matière seront accessibles une fois que vous aurez complété l'évaluation correspondante.
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
