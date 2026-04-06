<template>
  <div class="min-h-screen bg-[#fcfcfc]">
    <!-- Top bar -->
    <div class="top-bar">
      <button @click="$router.back()" class="back-btn">
        <ChevronLeft class="h-4 w-4" /> Retour
      </button>
      <div class="subject-chip">
        <BookOpen class="h-4 w-4" />
        {{ subjectName }} — {{ teacherName }}
      </div>
    </div>

    <!-- Shared evaluation form (langue + questions + submit) -->
    <div class="form-area">
      <EvaluationFormShared
        :questions="questions"
        :form-name="subjectName"
        :show-import-zone="true"
        @done="$router.push('/student')"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, BookOpen } from 'lucide-vue-next';
import EvaluationFormShared from '../../components/shared/EvaluationFormShared.vue';

const subjectName = "Mathématiques Appliquées";
const moduleName  = "Fondamentaux";
const teacherName = "Dr. Martin";

const questions = [
  { id: 1, text: "Mon enseignant.e m'a communiqué les règles de fonctionnement du cours lors des premières séances.", type: 'Likert', required: true },
  { id: 2, text: "Le contenu du cours correspond aux objectifs pédagogiques annoncés.", type: 'Likert', required: true },
  { id: 3, text: "Les supports de cours mis à disposition sont clairs et pertinents.", type: 'Likert', required: true },
  { id: 4, text: "La charge de travail demandée est adaptée au niveau et à la durée du module.", type: 'Likert', required: true },
  { id: 5, text: "Globalement, je suis satisfait.e de la qualité de cet enseignement.", type: 'Likert', required: true },
  { id: 6, text: "Commentaires libres (points positifs, suggestions d'amélioration…)", type: 'Texte', required: false },
];

function onSubmit(data) {
  console.log('Réponses soumises :', data);
}
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(228,224,235,0.5);
  background: white;
  flex-wrap: wrap;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5f527a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}
.back-btn:hover { background: #f3f0fa; color: #2f0d73; }

.subject-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c0845;
  background: #ede9fe;
  padding: 0.375rem 0.875rem;
  border-radius: 99px;
}

.form-area {
  padding: 2rem 1rem;
}
</style>
