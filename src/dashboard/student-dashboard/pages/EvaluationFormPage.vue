<script setup>
import QuestionCard from "./../components/QuestionCard.vue";
import StepProgress from "./../components/StepProgress.vue";
import {ref, computed, onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {getCourse, getCourseQuestions} from "../../actions/courses_actions.js";
import {getQuestions} from "../../actions/questions_actions.js";

const router = useRouter();
const route = useRoute();
const questions = ref([]);
const course = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const courseId = route.params.id;
    const [courseRes, questionsRes] = await Promise.all([
      getCourse(courseId),
      getQuestions()
    ]);
    course.value = courseRes;
    questions.value = questionsRes || [];
    answers.value = new Array(questions.value.length).fill(null);
  } catch (error) {
    console.error("Erreur lors du chargement de l'évaluation :", error);
  } finally {
    loading.value = false;
  }
});

// Options de réponses basées sur l'échelle de Likert
const options = [
  { id: 1, label: "Tout à fait d'accord", value: 4, stars: 4 },
  { id: 2, label: "Plutôt d'accord", value: 3, stars: 3 },
  { id: 3, label: "Plutôt pas d'accord", value: 2, stars: 2 },
  { id: 4, label: "Pas du tout d'accord", value: 1, stars: 1 },
  { id: 5, label: "Ne se prononce pas", value: 0, stars: -1 },
];

// État réactif
const currentQuestionIndex = ref(0);
const answers = ref([]);

// Propriétés calculées pour l'UI
const totalQuestions = computed(() => questions.value.length);
console.log(questions.value[currentQuestionIndex.value]);
const currentQuestionText = computed(() => questions.value[currentQuestionIndex.value]?.content || "");
const progressPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100;
});
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1);

// Logique de navigation
const nextStep = () => {
  if (isLastQuestion.value) {
    submitEvaluation();
  } else {
    currentQuestionIndex.value++;
  }
};

const prevStep = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// Simulation de l'envoi des données
const submitEvaluation = () => {
  const finalPayload = {
    courseId: course.value?.id,
    responses: answers.value.map((val, idx) => ({
        questionId: questions.value[idx].id,
        value: val
    })),
    submittedAt: new Date().toISOString()
  };

  console.log("ISIS Eval - Envoi des données :", finalPayload);

  // Redirection vers l'accueil après succès
  router.push('/dashboard/student');
};
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
    <div class="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin mb-4"></div>
    <p class="text-[#5f527a] font-medium">Chargement de l'évaluation...</p>
  </div>

  <div v-else-if="!course" class="text-center py-12">
    <p class="text-[#5f527a]">Cours introuvable.</p>
    <button @click="$router.back()" class="text-[#7c3aed] font-bold mt-4">Retour</button>
  </div>

  <div v-else class="max-w-2xl mx-auto">

    <button @click="$router.back()" class="text-sm text-[#5f527a] mb-6 flex items-center gap-1 hover:text-[#7c3aed] transition-colors">
      ← Retour au tableau de bord
    </button>

    <div class="bg-white p-6 rounded-[24px] border border-[#e4e0eb66] mb-8 shadow-sm relative overflow-hidden">
      <div class="absolute top-0 right-0 w-24 h-full bg-[#7c3aed]/5 -skew-x-12"></div>
      <h1 class="text-xl font-bold text-[#1c0845]">{{ course.title }}</h1>
      <p class="text-sm text-[#5f527a] font-medium opacity-70">
        {{ course.module?.title || 'UE' }} • {{ course.teacher.name || 'Enseignant' }}
      </p>
    </div>

    <StepProgress
        v-if="totalQuestions > 0"
        :current="currentQuestionIndex"
        :total="totalQuestions"
        :percentage="progressPercentage"
    />

    <div v-if="totalQuestions > 0">
        <transition name="slide" mode="out-in">
          <QuestionCard
              :key="currentQuestionIndex"
              :text="currentQuestionText"
              :options="options"
              v-model="answers[currentQuestionIndex]"
          />
        </transition>

        <div class="flex justify-between items-center mt-8">
          <button
              :disabled="currentQuestionIndex === 0"
              @click="prevStep"
              class="px-6 py-3 font-bold text-[#5f527a] disabled:opacity-20 hover:text-[#1c0845] transition-colors"
          >
            Précédent
          </button>

          <button
              @click="nextStep"
              :disabled="answers[currentQuestionIndex] === null"
              class="bg-[#2f0d73] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#7c3aed] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/10"
          >
            {{ isLastQuestion ? 'Envoyer l\'évaluation' : 'Suivant' }}
            <span v-if="!isLastQuestion">→</span>
          </button>
        </div>
    </div>

    <div v-else class="text-center py-12 bg-white rounded-[24px] border border-[#e4e0eb66]">
        <p class="text-[#5f527a]">Aucune question disponible pour ce cours.</p>
    </div>

  </div>
</template>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

/* Animation fluide lors du changement de question */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
