<script setup>
import { ref, onMounted, computed } from "vue";
import { Calendar, ChevronRight } from "lucide-vue-next";
import { getSemesters } from "../../actions/semesters_actions.js";

const semesterData = ref([]);
const loading = ref(true);

const academicYear = computed(() => {
  const today = new Date();
  const year = today.getFullYear();

  // Rule:
  // If (15 Sept 2025 <= today <= 15 Dec 2025) OR (1 Jan 2026 <= today <= 20 June 2026) -> 2025-2026
  // Otherwise -> 2026-2027

  // Note: Your request specifically mentions 2025-2026/2026-2027.
  // I will implement the logic based on the *current* real-time year to make it sustainable.

  const sept15 = new Date(year, 8, 15);
  const dec15  = new Date(year, 11, 15);
  const jan1   = new Date(year, 0, 1);
  const june20 = new Date(year, 5, 20);

  if ((today >= sept15 && today <= dec15)) {
      return `${year}-${year + 1}`;
  } else if (today >= jan1 && today <= june20) {
      return `${year - 1}-${year}`;
  } else {
      // If we are between 20 June and 15 September
      return `${year}-${year + 1}`;
  }
});

const promotionYearAndType = computed(() => {
    try {
        const semester = localStorage.getItem('currentSemester');
        return semester ? JSON.parse(semester).schoolYear : { promotionType: '', id: '' };
    } catch (e) {
        return { promotionType: '', id: '' };
    }
});

onMounted(async () => {
  try {
    const res = await getSemesters({ studentPromotionId: localStorage.getItem('studentPromotionId') });
    semesterData.value = res || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des semestres:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center mb-12">
    <div class="bg-white p-6 rounded-[32px] border border-[#e4e0eb66] shadow-sm flex items-center gap-6 w-fit px-12 group hover:border-[#7c3aed] transition-colors">
      <div class="bg-[#f2f1f4] p-4 rounded-2xl group-hover:bg-purple-50 transition-colors">
        <Calendar class="h-8 w-8 text-[#1c0845] group-hover:text-[#7c3aed]" />
      </div>
      <div>
        <h2 class="text-2xl font-black text-[#1c0845]">{{ academicYear }}</h2>
        <p class="text-[#5f527a] text-sm font-bold uppercase tracking-widest opacity-60">Année académique</p>
      </div>
    </div>
  </div>

  <div v-if="loading" class="flex justify-center py-12">
    <div class="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
  </div>

  <div v-else-if="semesterData.length === 0" class="text-center py-12">
    <p class="text-[#5f527a]">Aucun semestre trouvé.</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <router-link v-for="sem in semesterData" :key="sem.id"
         :to="`/dashboard/student/semesters/${sem.id}/modules`"
         class="bg-white p-8 rounded-[45px] border border-[#e4e0eb66] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden">
      <span :class="['absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-150', sem.active ? 'bg-[#2f0d73]' : 'bg-gray-400']"></span>

      <span class="flex justify-between items-start mb-8">
        <span :class="['w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-xl shadow-lg transition-all group-hover:rotate-6', sem.active ? 'bg-gradient-to-br from-[#2f0d73] to-[#7c3aed]' : 'bg-[#9ca3af]']">
          S{{ sem.id }}
        </span>
        <span class="p-2 rounded-full bg-gray-50 group-hover:bg-purple-50 group-hover:text-[#7c3aed] transition-colors">
          <ChevronRight class="h-6 w-6 text-[#5f527a] group-hover:translate-x-1 transition-transform" />
        </span>
      </span>
      <h3 class="text-2xl font-bold text-[#1c0845] mb-1">Semestre {{ sem.id }}</h3>
      <span class="flex items-center gap-2 text-[#5f527a] text-xs font-bold mb-8">
        <span class="px-2 py-0.5 rounded bg-gray-100 uppercase">{{promotionYearAndType.promotionType}}{{promotionYearAndType.id}}</span>
        <span class="text-gray-300">•</span>
        <span>{{ sem.totalModules || 0 }} Modules total</span>
      </span>
      <span class="space-y-3">
        <span class="flex justify-between text-xs font-black uppercase tracking-tighter">
          <span class="text-[#5f527a]">Progression des évaluations</span>
          <span class="text-[#1c0845]">{{ sem.totalModules ? Math.round((sem.completedModules / sem.totalModules) * 100) : 0 }}%</span>
        </span>
        <span class="w-full bg-[#f2f1f4] h-3 rounded-full overflow-hidden border border-gray-50">
          <span :class="['h-full rounded-full transition-all duration-1000 ease-out shadow-sm', sem.active ? 'bg-gradient-to-r from-[#2f0d73] to-[#7c3aed]' : 'bg-gray-300']"
               :style="{ width: sem.totalModules ? (sem.completedModules / sem.totalModules) * 100 + '%' : '0%' }"></span>
        </span>
        <span class="text-[10px] text-[#5f527a] font-medium">{{ sem.completedModules || 0 }} modules complétés sur {{ sem.totalModules || 0 }}</span>
      </span>
      <div v-if="sem.active" class="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
        Session Ouverte
      </div>
      <div v-else class="mt-6 inline-flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
        Bientôt disponible
      </div>
    </router-link>
  </div>
</template>

<style scoped>
</style>
