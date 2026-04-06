<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BarChart3, Loader2, Info, ChevronRight } from 'lucide-vue-next';
import { getModules } from "../actions/modules_actions.js";
import { getSemester } from "../actions/semesters_actions.js";

const route = useRoute();
const semesterId = route.params.id;

const semesterInfo = ref(null);
const modules = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    // Fetch semester info and modules in parallel
    const [modulesRes, semesterRes] = await Promise.all([
      getModules({ semesterId }),
      getSemester(semesterId) // Using getSemester(id) instead of getSemesters()
    ]);

    semesterInfo.value = semesterRes;
    modules.value = modulesRes || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des données de statistiques:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <router-link to="/dashboard/student/home"
               class="text-sm text-[#5f527a] mb-6 flex items-center gap-2 hover:text-[#7c3aed] transition-colors">
    ← Retour aux semestres
  </router-link>
  <div class="mb-10">
    <h1 class="text-[32px] font-bold text-[#1c0845] mb-2 flex items-center gap-3">
      <BarChart3 class="w-8 h-8 text-[#2f0d73]"/>
      {{ semesterInfo?.name || `Semestre ${semesterId}` }}
    </h1>
    <p class="text-[#5f527a] text-sm font-medium">
      {{ semesterInfo?.schoolYear?.name ? `Année académique ${semesterInfo.schoolYear.name}` : '' }}
      • Consultez les résultats par Unité d'Enseignement (UE).
    </p>
  </div>

  <div v-if="loading" class="flex flex-col items-center justify-center py-12">
    <Loader2 class="w-10 h-10 text-[#7c3aed] animate-spin mb-4" />
    <p class="text-[#5f527a] font-medium">Chargement des statistiques...</p>
  </div>

  <div v-else-if="modules.length === 0" class="text-center py-12 bg-white rounded-[25px] border border-[#e4e0eb66]">
    <p class="text-[#5f527a]">Aucun module trouvé pour ce semestre.</p>
  </div>

  <div v-else class="space-y-4 max-w-5xl">
    <div v-for="mod in modules" :key="mod.id"
         class="bg-white p-6 rounded-[25px] border border-[#e4e0eb66] shadow-sm flex items-center justify-between hover:border-[#7c3aed]/30 transition-all group">

      <div class="flex items-center gap-5">
        <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7c3aed] group-hover:bg-[#2f0d73] group-hover:text-white transition-colors">
          <BarChart3 class="w-6 h-6"/>
        </div>
        <div>
          <h4 class="text-lg font-bold text-[#1c0845]">{{ mod.title }}</h4>
          <p class="text-xs text-[#5f527a] font-bold uppercase tracking-wider">UE {{ mod.id }} • {{ mod.numberCourses || 0 }} matières</p>
          <p class="text-[10px] text-[#5f527a]/60 mt-0.5 line-clamp-1 max-w-md">{{ mod.description }}</p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div class="flex flex-col items-end min-w-[100px]">
            <span class="text-[10px] font-black uppercase text-[#5f527a] mb-1 tracking-tighter">Participation</span>
            <div class="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <!-- Using calculated progress if available, else 0 -->
                <div class="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] h-full rounded-full transition-all duration-1000"
                     :style="{ width: mod.numberCourses ? (mod.numberCourseValidated / mod.numberCourses * 100) + '%' : '0%' }"></div>
            </div>
            <span class="text-[10px] font-bold text-[#1c0845] mt-1">{{ mod.numberCourseValidated || 0 }}/{{ mod.numberCourses || 0 }}</span>
        </div>

        <router-link :to="`/dashboard/student/stats/semester/${semesterId}/module/${mod.id}`"
                     class="bg-[#f2f1f4] text-[#2f0d73] p-2 rounded-full hover:bg-[#2f0d73] hover:text-white transition-all">
          <ChevronRight class="w-5 h-5" />
        </router-link>
      </div>
    </div>

    <div class="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4">
      <Info class="w-5 h-5 text-[#7c3aed] mt-0.5" />
      <div>
        <h5 class="text-xs font-bold text-[#1c0845] mb-1">À propos de vos statistiques</h5>
        <p class="text-[11px] text-[#5f527a] leading-relaxed">
          Les graphiques de performance comparent vos réponses (anonymisées) à la moyenne globale de votre promotion ({{ semesterInfo?.schoolYear?.name }}).
          Les données sont mises à jour en temps réel après chaque évaluation.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
