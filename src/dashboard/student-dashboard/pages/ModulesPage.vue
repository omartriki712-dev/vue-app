<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ChevronRight, BookText, Terminal, Code, Users2, Brain, BarChart3, HelpCircle} from 'lucide-vue-next';
import {getModules} from "../../actions/modules_actions.js";

const route = useRoute();
const router = useRouter();
const semesterId = computed(() => route.params.id);
const modules = ref([]);
const loading = ref(true);

const iconMap = {
  BookText,
  Terminal,
  Code,
  Users2,
  Brain,
  BarChart3
};

const getIcon = (iconName) => {
  return iconMap[iconName] || HelpCircle;
};

onMounted(async () => {
  try {
    loading.value = true;
    const res = await getModules({
      semesterId: semesterId.value,
      studentPromotionId: localStorage.getItem('studentPromotionId')
    });
    modules.value = res || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h2 class="ml-4 text-lg font-bold text-[#1c0845] mb-6">Unités d'enseignement</h2>

  <div v-if="loading" class="flex justify-center py-12">
    <div class="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
  </div>

  <div v-else-if="modules.length === 0" class="text-center py-12">
    <p class="text-[#5f527a]">Aucun module trouvé pour ce semestre.</p>
  </div>

  <div v-else class="max-w-4xl ml-4 space-y-4">
    <div v-for="ue in modules" :key="ue.id" @click="router.push(`/dashboard/student/semesters/${semesterId}/modules/${ue.id}/courses`)"
         class="bg-white p-5 rounded-[24px] border border-[#e4e0eb66] shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[110px]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-5 flex-grow">
          <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#d946ef]">
            <component :is="getIcon(ue.icons)" class="w-6 h-6"/>
          </div>
          <div class="flex-grow">
            <p class="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.15em] mb-0.5">UE {{ ue.id }}</p>
            <h3 class="text-lg font-bold text-[#1c0845] group-hover:text-[#7c3aed] transition-colors">{{
                ue.title
              }}</h3>
            <p class="text-xs text-[#5f527a]/60 font-medium">{{ ue.description }}</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2 min-w-[120px]">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-[#1c0845]">
                {{ ue.numberCourses ? Math.round((ue.numberCourseValidated / ue.numberCourses) * 100) : 0 }}%
            </span>
            <ChevronRight
                class="w-4 h-4 text-[#1c0845]/20 group-hover:text-[#7c3aed] group-hover:translate-x-1 transition-all"/>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between text-[9px] font-black uppercase tracking-widest text-[#5f527a]/50 mb-1.5">
          <span>{{ ue.numberCourseValidated }} / {{ ue.numberCourses }} matières</span>
        </div>
        <div class="w-full bg-[#f3f4f6] h-1.5 rounded-full overflow-hidden">
          <div :style="{ width: ue.numberCourses ? (ue.numberCourseValidated / ue.numberCourses) * 100 + '%' : '0%' }"
               class="h-full rounded-full bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#d946ef] transition-all duration-1000 shadow-[0_0_8px_rgba(124,58,237,0.3)]">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
