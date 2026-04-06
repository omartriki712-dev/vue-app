<template>
  <div class="eval-wrapper">

    <!-- ── LANGUE VIVANTE SELECTION (shown first if not in preview mode) ── -->
    <div v-if="!previewMode && step === 'langue'" class="step-container">
      <div class="step-card">
        <div class="step-icon-wrap">
          <Languages class="h-8 w-8" />
        </div>
        <h2 class="step-title">Langue vivante</h2>
        <p class="step-sub">Sélectionnez la langue que vous étudiez dans ce module.</p>

        <div class="lang-grid">
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="lang-btn"
            :class="selectedLang === lang.code ? 'lang-btn--active' : ''"
            @click="selectedLang = lang.code"
            type="button"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
            <span v-if="selectedLang === lang.code" class="lang-check">✓</span>
          </button>
        </div>

        <button
          class="btn-next"
          :disabled="!selectedLang"
          @click="step = 'form'"
        >
          Continuer
          <ChevronRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- ── EXCEL IMPORT (student or admin, shown before form) ── -->
    <div v-if="!previewMode && step === 'form' && showImportZone" class="import-banner">
      <div
        class="drop-zone"
        :class="isDragging ? 'drop-zone--active' : ''"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <FileSpreadsheet class="h-6 w-6 drop-zone-icon" :class="isDragging ? 'drop-zone-icon--active' : ''" />
        <div>
          <p class="drop-title">Importer vos réponses via Excel / CSV</p>
          <p class="drop-sub">Optionnel — ou remplissez le formulaire ci-dessous</p>
        </div>
        <button class="btn-browse" type="button" @click="$refs.importInput.click()">Parcourir</button>
        <input ref="importInput" type="file" class="hidden" accept=".csv,.xlsx,.xls" @change="handleFile" />
      </div>
    </div>

    <!-- ── QUESTION FORM ── -->
    <div v-if="step === 'form' || previewMode" class="step-container">

      <!-- Header info -->
      <div class="form-header-card">
        <h1 class="form-title">{{ formName || 'Questionnaire d\'évaluation' }}</h1>
        <p v-if="selectedLang && !previewMode" class="form-lang-info">
          <span class="lang-flag-sm">{{ langFlag }}</span>
          {{ langName }}
        </p>
      </div>

      <!-- Progress -->
      <div class="progress-block">
        <div class="progress-labels">
          <span>Question {{ currentIdx + 1 }} sur {{ totalQuestions }}</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progress + '%' }" />
        </div>
      </div>

      <!-- Question card -->
      <div v-if="currentQuestion" class="question-card">
        <div class="q-meta">
          <span class="q-type-badge" :class="typeBadgeClass(currentQuestion.type)">{{ currentQuestion.type }}</span>
          <span v-if="currentQuestion.required" class="q-required-label">* Obligatoire</span>
        </div>
        <h2 class="q-text">{{ currentQuestion.text }}</h2>

        <!-- Likert -->
        <div v-if="currentQuestion.type === 'Likert'" class="answers-list">
          <label
            v-for="opt in likertOptions"
            :key="opt.value"
            class="answer-item"
            :class="answers[currentQuestion.id] === opt.value ? 'answer-item--selected' : ''"
          >
            <input type="radio" :name="'q-' + currentQuestion.id" :value="opt.value" v-model="answers[currentQuestion.id]" class="radio-hidden" />
            <div class="answer-left">
              <div class="radio-circle" :class="answers[currentQuestion.id] === opt.value ? 'radio-circle--on' : ''"></div>
              <span class="answer-label">{{ opt.label }}</span>
            </div>
            <div class="stars-row" v-if="opt.stars >= 0">
              <Star
                v-for="i in 3"
                :key="i"
                class="star"
                :class="i <= opt.stars ? 'star--on' : 'star--off'"
              />
            </div>
          </label>
        </div>

        <!-- QCM -->
        <div v-if="currentQuestion.type === 'QCM'" class="answers-list">
          <label
            v-for="opt in (currentQuestion.options || [])"
            :key="opt"
            class="answer-item"
            :class="answers[currentQuestion.id] === opt ? 'answer-item--selected' : ''"
          >
            <input type="radio" :name="'q-' + currentQuestion.id" :value="opt" v-model="answers[currentQuestion.id]" class="radio-hidden" />
            <div class="answer-left">
              <div class="radio-circle" :class="answers[currentQuestion.id] === opt ? 'radio-circle--on' : ''"></div>
              <span class="answer-label">{{ opt }}</span>
            </div>
          </label>
        </div>

        <!-- Texte libre -->
        <div v-if="currentQuestion.type === 'Texte'" class="text-answer">
          <textarea
            v-model="answers[currentQuestion.id]"
            class="text-input"
            placeholder="Partagez vos commentaires ici..."
            rows="5"
          />
        </div>
      </div>

      <!-- Navigation -->
      <div class="nav-row">
        <button
          class="btn-prev"
          :disabled="currentIdx === 0"
          @click="prev"
        >
          ← Précédent
        </button>
        <button
          v-if="!isLast"
          class="btn-next"
          @click="next"
        >
          Suivant <ChevronRight class="h-5 w-5" />
        </button>
        <button
          v-else-if="!previewMode"
          class="btn-submit"
          @click="submit"
        >
          <CheckCircle class="h-5 w-5" /> Envoyer l'évaluation
        </button>
        <span v-else class="preview-end-note">Fin du formulaire (aperçu)</span>
      </div>
    </div>

    <!-- ── CONFIRMATION ── -->
    <div v-if="step === 'done'" class="step-container">
      <div class="done-card">
        <div class="done-icon"><CheckCircle class="h-12 w-12" /></div>
        <h2 class="done-title">Merci pour votre évaluation !</h2>
        <p class="done-sub">Vos réponses ont bien été enregistrées de manière anonyme.</p>
        <button class="btn-next" @click="$emit('done')">Retour au tableau de bord</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Languages, ChevronRight, Star, CheckCircle, FileSpreadsheet } from 'lucide-vue-next';

const props = defineProps({
  questions:   { type: Array, default: () => [] },
  formName:    { type: String, default: '' },
  previewMode: { type: Boolean, default: false },
  showImportZone: { type: Boolean, default: false },
});
const emit = defineEmits(['done', 'submit']);

// ── Languages ──────────────────────────────────────────────
const languages = [
  { code: 'en', name: 'Anglais',     flag: '🇬🇧' },
  { code: 'es', name: 'Espagnol',    flag: '🇪🇸' },
  { code: 'de', name: 'Allemand',    flag: '🇩🇪' },
  { code: 'it', name: 'Italien',     flag: '🇮🇹' },
  { code: 'zh', name: 'Chinois',     flag: '🇨🇳' },
  { code: 'pt', name: 'Portugais',   flag: '🇵🇹' },
  { code: 'ar', name: 'Arabe',       flag: '🇸🇦' },
  { code: 'ja', name: 'Japonais',    flag: '🇯🇵' },
  { code: 'ru', name: 'Russe',       flag: '🇷🇺' },
];

const selectedLang = ref(null);
const langFlag = computed(() => languages.find(l => l.code === selectedLang.value)?.flag || '');
const langName = computed(() => languages.find(l => l.code === selectedLang.value)?.name || '');

// ── Steps ──────────────────────────────────────────────────
// 'langue' → 'form' → 'done'
const step = ref(props.previewMode ? 'form' : 'langue');

// ── Questions ─────────────────────────────────────────────
const currentIdx = ref(0);
const answers    = ref({});

const currentQuestion = computed(() => props.questions[currentIdx.value]);
const totalQuestions  = computed(() => props.questions.length);
const isLast          = computed(() => currentIdx.value === totalQuestions.value - 1);
const progress        = computed(() => totalQuestions.value ? ((currentIdx.value + 1) / totalQuestions.value) * 100 : 0);

function next() { if (!isLast.value) currentIdx.value++; }
function prev() { if (currentIdx.value > 0) currentIdx.value--; }
function submit() {
  emit('submit', { answers: answers.value, lang: selectedLang.value });
  step.value = 'done';
}

// ── Likert ────────────────────────────────────────────────
const likertOptions = [
  { label: "Tout à fait d'accord",   value: 4, stars: 3 },
  { label: "Plutôt d'accord",        value: 3, stars: 2 },
  { label: "Plutôt pas d'accord",    value: 2, stars: 1 },
  { label: "Pas du tout d'accord",   value: 1, stars: 0 },
  { label: "Ne se prononce pas",     value: 0, stars: -1 },
];

// ── Import ────────────────────────────────────────────────
const isDragging = ref(false);
function handleDrop(e) { isDragging.value = false; const f = e.dataTransfer.files[0]; if (f) console.log('Import:', f.name); }
function handleFile(e)  { const f = e.target.files[0]; if (f) console.log('Import:', f.name); }

// ── Helpers ───────────────────────────────────────────────
function typeBadgeClass(type) {
  return { Likert: 'type-likert', QCM: 'type-qcm', Texte: 'type-text' }[type] || '';
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.eval-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 680px;
  margin: 0 auto;
  animation: fadeIn 0.35s ease-out;
}

/* Step container */
.step-container { display: flex; flex-direction: column; gap: 1.25rem; }

.step-card {
  background: white; border-radius: 1.5rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 2px 8px rgba(47,13,115,0.07);
  padding: 2.5rem; display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem; text-align: center;
}

.step-icon-wrap {
  width: 4rem; height: 4rem; border-radius: 1.25rem;
  background: linear-gradient(135deg, #2f0d73, #7c3aed);
  color: white; display: flex; align-items: center; justify-content: center;
}

.step-title { font-size: 1.4rem; font-weight: 700; color: #1c0845; }
.step-sub   { font-size: 0.9rem; color: #5f527a; max-width: 380px; }

/* Language grid */
.lang-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-width: 480px;
}

.lang-btn {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; padding: 1rem 0.5rem;
  background: #f8f7fa; border: 2px solid transparent;
  border-radius: 1rem; cursor: pointer;
  transition: all 0.18s ease;
}
.lang-btn:hover { border-color: #c4b5fd; background: #f5f3ff; }
.lang-btn--active { border-color: #2f0d73; background: #ede9fe; }

.lang-flag { font-size: 2rem; line-height: 1; }
.lang-name { font-size: 0.75rem; font-weight: 600; color: #1c0845; }
.lang-check {
  position: absolute; top: 0.4rem; right: 0.6rem;
  font-size: 0.65rem; font-weight: 900; color: white;
  background: #2f0d73; border-radius: 50%;
  width: 1.1rem; height: 1.1rem;
  display: flex; align-items: center; justify-content: center;
}

/* Import banner */
.import-banner { }
.drop-zone {
  display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
  border: 2px dashed rgba(124,58,237,0.25); border-radius: 1rem;
  padding: 1rem 1.25rem; background: white;
  transition: all 0.2s ease;
}
.drop-zone:hover { border-color: rgba(124,58,237,0.5); }
.drop-zone--active { border-color: #7c3aed; background: #f5f3ff; }
.drop-zone-icon { color: #7c3aed; flex-shrink: 0; }
.drop-zone-icon--active { color: #2f0d73; }
.drop-title { font-size: 0.875rem; font-weight: 700; color: #1c0845; }
.drop-sub { font-size: 0.75rem; color: #5f527a; }
.btn-browse {
  padding: 0.4rem 1rem; background: white; color: #2f0d73;
  border: 1px solid #2f0d73; border-radius: 0.65rem; font-size: 0.8rem;
  font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: all 0.15s ease; margin-left: auto;
}
.btn-browse:hover { background: #f5f3ff; }
.hidden { display: none; }

/* Form header card */
.form-header-card {
  background: white; border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 1.25rem 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 0.75rem;
}
.form-title { font-size: 1.1rem; font-weight: 700; color: #1c0845; }
.form-lang-info {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.8rem; font-weight: 600; color: #5f527a;
  background: #f8f7fa; padding: 0.35rem 0.75rem; border-radius: 99px;
}
.lang-flag-sm { font-size: 1.1rem; }

/* Progress */
.progress-block { display: flex; flex-direction: column; gap: 0.375rem; }
.progress-labels { display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #1c0845; }
.progress-track { width: 100%; height: 6px; background: #f2f1f4; border-radius: 99px; overflow: hidden; }
.progress-bar { height: 100%; background: linear-gradient(to right, #2f0d73, #7c3aed); border-radius: 99px; transition: width 0.3s ease; }

/* Question card */
.question-card {
  background: white; border-radius: 1.5rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 2px 8px rgba(47,13,115,0.07);
  padding: 2rem;
  display: flex; flex-direction: column; gap: 1.25rem;
  animation: slideUp 0.25s ease-out;
}

.q-meta { display: flex; align-items: center; gap: 0.5rem; }
.q-type-badge { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.55rem; border-radius: 4px; text-transform: uppercase; }
.type-likert { background: #ede9fe; color: #5b21b6; }
.type-qcm    { background: #dbeafe; color: #1d4ed8; }
.type-text   { background: #dcfce7; color: #15803d; }
.q-required-label { font-size: 0.72rem; color: #ef4444; font-weight: 600; }

.q-text { font-size: 1.05rem; font-weight: 600; color: #1c0845; line-height: 1.55; }

/* Answers */
.answers-list { display: flex; flex-direction: column; gap: 0.625rem; }
.answer-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border: 1.5px solid #e4e0eb; border-radius: 0.875rem;
  cursor: pointer; transition: all 0.15s ease;
}
.answer-item:hover { border-color: #c4b5fd; background: #faf8ff; }
.answer-item--selected { border-color: #7c3aed; background: rgba(124,58,237,0.05); }

.answer-left { display: flex; align-items: center; gap: 0.875rem; }
.radio-hidden { display: none; }
.radio-circle {
  width: 1.125rem; height: 1.125rem;
  border: 2px solid #c4b5d0; border-radius: 50%;
  flex-shrink: 0; transition: all 0.15s ease;
}
.radio-circle--on { border-color: #7c3aed; background: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
.answer-label { font-size: 0.875rem; font-weight: 500; color: #1c0845; }

.stars-row { display: flex; gap: 0.15rem; }
.star { width: 1rem; height: 1rem; }
.star--on  { color: #f59e0b; fill: #f59e0b; }
.star--off { color: #e5e7eb; }

/* Text answer */
.text-answer { }
.text-input {
  width: 100%; padding: 0.875rem 1rem;
  border: 1.5px solid #e4e0eb; border-radius: 0.875rem;
  font-size: 0.9rem; color: #1c0845;
  outline: none; resize: vertical;
  background: #f8f7fa; transition: all 0.2s ease;
  box-sizing: border-box; font-family: inherit;
}
.text-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: white; }

/* Nav buttons */
.nav-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.25rem 0;
}
.btn-prev {
  padding: 0.7rem 1.25rem;
  background: none; border: none; color: #5f527a;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: color 0.15s ease;
}
.btn-prev:hover:not(:disabled) { color: #2f0d73; }
.btn-prev:disabled { opacity: 0.35; cursor: not-allowed; }

.btn-next {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: #2f0d73; color: white;
  border: none; border-radius: 0.875rem;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(47,13,115,0.25);
}
.btn-next:hover:not(:disabled) { background: #1c0845; box-shadow: 0 6px 16px rgba(47,13,115,0.3); }
.btn-next:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-submit {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; border: none; border-radius: 0.875rem;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(5,150,105,0.25);
}
.btn-submit:hover { filter: brightness(1.05); }

.preview-end-note { font-size: 0.8rem; color: #9ca3af; font-style: italic; }

/* Done card */
.done-card {
  background: white; border-radius: 1.5rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 2px 8px rgba(47,13,115,0.07);
  padding: 3rem 2rem; display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem; text-align: center;
}
.done-icon { color: #10b981; }
.done-title { font-size: 1.4rem; font-weight: 700; color: #1c0845; }
.done-sub { font-size: 0.9rem; color: #5f527a; }
</style>
