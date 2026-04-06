<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {AlertCircle, BookOpen, CheckCircle2, ChevronRight, Home, Loader2} from "lucide-vue-next";
import {getModule} from "../../actions/modules_actions.js";
import {getCourses} from "../../actions/courses_actions.js";
import {getForm} from "../../actions/form_actions.js";

const route = useRoute();
const moduleId = route.params.moduleId;

const moduleData = ref(null);
const subjects = ref([]);
const loading = ref(true);

const form = ref();

// Function to calculate days remaining based on module's end date
const getDaysRemaining = () => {const completedCount = computed(() => subjects.value.filter(s => s.formEvaluated).length);

  if (!moduleData.value || !moduleData.value.dayEnd || !moduleData.value.monthEnd) return 0;
  const today = new Date();
  const currentYear = today.getFullYear();
  const deadline = new Date(currentYear, parseInt(moduleData.value.monthEnd) - 1, moduleData.value.dayEnd);

  // If the deadline has already passed this year, assume it's next year (for academic years)
  if (deadline < today) {
    deadline.setFullYear(currentYear + 1);
  }

  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

onMounted(async () => {
  try {
    loading.value = true;
    form.value = await getForm();
    console.log(form.value);
    const [moduleRes, coursesRes] = await Promise.all([
      getModule( moduleId ),
      getCourses({ moduleId, studentPromotionId: localStorage.getItem('studentPromotionId') })
    ]);
    moduleData.value = moduleRes;
    subjects.value = coursesRes || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du module:", error);
  } finally {
    loading.value = false;
  }
});

const completedCount = computed(() => subjects.value.filter(s => s.formEvaluated).length);
const progressPercentage = computed(() => {
  if (subjects.value.length === 0) return 0;
  return Math.round((completedCount.value / subjects.value.length) * 100);
});

const daysRemaining = computed(() => getDaysRemaining());
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 class="w-10 h-10 text-[#7c3aed] animate-spin mb-4" />
    <p class="text-[#5f527a] font-medium">Chargement du module...</p>
  </div>

  <div v-else-if="!moduleData" class="text-center py-12">
    <p class="text-[#5f527a]">Module introuvable.</p>
    <router-link to="/dashboard/student/home" class="text-[#7c3aed] font-bold mt-4 inline-block">Retour à l'accueil</router-link>
  </div>

  <div v-else>
    <!-- Breadcrumbs -->
    <div class="mb-8 ml-4 flex items-center gap-2 text-[13px] text-[#5f527a]">
      <router-link to="/dashboard/student/home">
        <Home class="w-4 h-4 cursor-pointer hover:text-[#7c3aed]" />
      </router-link>
      <ChevronRight class="w-3 h-3 opacity-40" />
      <router-link to="/dashboard/student/home" class="cursor-pointer hover:text-[#7c3aed]">
        Accueil
      </router-link>
      <ChevronRight class="w-3 h-3 opacity-40" />
      <router-link :to="`/dashboard/student/semesters/${route.params.semesterId}/modules`" class="cursor-pointer hover:text-[#7c3aed]">
        {{ moduleData.semester?.name || 'Semestre' }}
      </router-link>
      <ChevronRight class="w-3 h-3 opacity-40" />
      <span class="font-bold text-[#7c3aed]">{{ moduleData.title }}</span>
    </div>

    <!-- Header -->
    <div class="mb-10 ml-4">
      <h1 class="text-[32px] font-bold text-[#1c0845]">{{ moduleData.title }}</h1>
      <p class="text-[#5f527a] font-medium">{{ moduleData.description }} • UE {{ moduleData.id }}</p>
    </div>

    <!-- Progress Card -->
    <div class="bg-white p-8 rounded-[32px] border border-[#e4e0eb66] shadow-sm mb-10 max-w-4xl ml-4">
      <div class="flex justify-between items-end mb-4">
        <div>
          <h3 class="text-lg font-bold text-[#1c0845]">Progression - {{ moduleData.title }}</h3>
          <p class="text-[#5f527a] text-sm">{{ completedCount }} sur {{ subjects.length }} évaluations complétées</p>
        </div>
        <span class="text-4xl font-black text-[#7c3aed]">{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-[#f2f1f4] h-4 rounded-full overflow-hidden">
        <div class="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] h-full rounded-full transition-all duration-1000"
             :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Subjects List -->
    <div class="space-y-4 max-w-4xl ml-4">
      <div v-for="sub in subjects" :key="sub.id"
           class="bg-white p-6 rounded-[24px] border border-[#e4e0eb66] shadow-sm flex items-center justify-between transition-all hover:border-[#7c3aed]/30">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#7c3aed]">
            <BookOpen class="h-7 w-7" />
          </div>
          <div>
            <p class="text-[10px] font-black text-[#8b5cf6] uppercase tracking-wider">{{ sub.code }}</p>
            <h4 class="font-bold text-[#1c0845]">{{ sub.title }}</h4>
            <p class="text-xs text-[#5f527a]">Cours • UE {{ moduleData.id }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div v-if="!sub.formEvaluated"
               :class="[ 'flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full',
                             daysRemaining <= 3 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50' ]">
            <AlertCircle class="w-3 h-3" />
            <span>{{ daysRemaining > 0 ? `Il vous reste ${daysRemaining} jours` : 'Session expirée' }}</span>
          </div>


          <router-link v-if="!sub.formEvaluated"
                  :to="`/dashboard/student/semesters/${route.params.semesterId}/modules/${moduleId}/courses/${sub.id}/evaluate`"
                  class="bg-[#2f0d73] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#7c3aed] transition-all">
            Évaluer →
          </router-link>
          <div v-else class="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 text-sm">
            <CheckCircle2 class="h-4 w-4" /> Complétée
          </div>
        </div>
      </div>

      <!-- Anonymity Notice -->
      <div class="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-4 mt-8">
        <CheckCircle2 class="w-6 h-6 text-[#7c3aed] mt-1" />
        <div>
          <h5 class="text-sm font-bold text-[#1c0845]">Vos réponses sont anonymes</h5>
          <p class="text-xs text-[#5f527a]">Toutes vos évaluations sont enregistrées de manière totalement anonyme. Aucune donnée personnelle n'est associée à vos réponses. Participez en toute confiance !</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
