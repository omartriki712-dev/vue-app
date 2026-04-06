<template>
  <div class="min-h-screen bg-[#fcfcfc] p-12 font-jakarta">
    <div class="max-w-2xl mx-auto">
      <button @click="$router.back()" class="text-sm text-[#5f527a] mb-6 flex items-center gap-1 hover:text-[#7c3aed]">
        ← Retour au tableau de bord
      </button>

      <div class="bg-white p-6 rounded-[24px] border border-[#e4e0eb66] mb-8 shadow-sm">
        <h1 class="text-xl font-bold text-[#1c0845]">{{ subjectName }}</h1>
        <p class="text-sm text-[#5f527a]">{{ moduleName }} • {{ teacherName }}</p>
      </div>

      <div class="mb-8">
        <div class="flex justify-between text-xs font-bold text-[#1c0845] mb-2">
          <span>Question {{ currentQuestionIndex + 1 }} sur {{ totalQuestions }}</span>
          <span>{{ Math.round(progressPercentage) }}%</span>
        </div>
        <div class="w-full bg-[#f2f1f4] h-2 rounded-full overflow-hidden">
          <div class="bg-[#7c3aed] h-full rounded-full transition-all duration-300" 
               :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-[24px] border border-[#e4e0eb66] shadow-sm">
        <h2 class="text-lg font-bold text-[#1c0845] mb-6">{{ currentQuestionText }}</h2>
        
        <div class="space-y-3">
          <label v-for="option in options" :key="option.id" 
                 :class="['flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all', 
                         selectedAnswer === option.value ? 'border-[#7c3aed] bg-purple-50/50' : 'border-[#e4e0eb66] hover:border-purple-200']">
            
            <div class="flex items-center">
              <input type="radio" v-model="selectedAnswer" :value="option.value" class="mr-4 accent-[#7c3aed]">
              <span class="text-sm font-medium text-[#1c0845]">{{ option.label }}</span>
            </div>

            <div class="flex gap-0.5" v-if="option.stars !== -1">
              <Star v-for="i in 3" :key="i" 
                    :class="['w-4 h-4', i <= option.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200']" />
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-between items-center mt-8">
        <button :disabled="currentQuestionIndex === 0" @click="currentQuestionIndex--" 
                class="px-6 py-3 font-bold text-[#5f527a] disabled:opacity-30">Précédent</button>
        
        <button @click="nextQuestion" 
                class="bg-[#2f0d73] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#7c3aed] transition-all">
          {{ isLastQuestion ? 'Envoyer l\'évaluation' : 'Suivant' }}
          <span v-if="!isLastQuestion">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Star } from "lucide-vue-next";

const router = useRouter();
const currentQuestionIndex = ref(0);

const questions = [
  "Mon enseignant.e m’a communiqué les règles de fonctionnement du cours (programme, déroulement, modalités d’évaluation) lors des premières séances.",
  "Le contenu du cours correspond aux objectifs pédagogiques annoncés.",
  "Les supports de cours mis à disposition sont clairs et pertinents.",
  "La charge de travail demandée est adaptée au niveau et à la durée du module.",
  "Globalement, je suis satisfait.e de la qualité de cet enseignement."
];

const currentQuestionText = computed(() => questions[currentQuestionIndex.value]);
const totalQuestions = questions.length;
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions) * 100);
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1);

// Final Scale Mapping:
// Tout à fait d'accord: 3 stars
// Plutôt d'accord: 2 stars
// Plutôt pas d'accord: 1 star
// Pas du tout d'accord: 0 stars
// Ne se prononce pas: No stars (-1)
const options = [
  { id: 1, label: "Tout à fait d'accord", value: 4, stars: 3 },
  { id: 2, label: "Plutôt d'accord", value: 3, stars: 2 },
  { id: 3, label: "Plutôt pas d'accord", value: 2, stars: 1 },
  { id: 4, label: "Pas du tout d'accord", value: 1, stars: 0 },
  { id: 5, label: "Ne se prononce pas", value: 0, stars: -1 },
];

const selectedAnswer = ref(null);

const nextQuestion = () => {
  if (isLastQuestion.value) {
    router.push('/student'); 
  } else {
    currentQuestionIndex.value++;
    selectedAnswer.value = null;
  }
};

const subjectName = "Mathématiques Appliquées";
const moduleName = "Fondamentaux";
const teacherName = "Dr. Martin";
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>