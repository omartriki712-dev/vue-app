<template>
  <div class="page-container">

    <!-- ════════════════ LIST VIEW ════════════════ -->
    <template v-if="view === 'list'">
      <div class="page-header">
        <div>
          <h2 class="page-title">Questionnaires d'évaluation</h2>
          <p class="page-subtitle">{{ forms.length }} questionnaire(s) configuré(s)</p>
        </div>
        <button class="btn-primary" @click="openCreateForm">
          <Plus class="h-4 w-4" /> Nouveau questionnaire
        </button>
      </div>

      <div class="forms-grid">
        <div v-for="form in forms" :key="form.id" class="form-card">
          <div class="form-card-top">
            <div class="form-icon"><ClipboardList class="h-6 w-6" /></div>
            <span class="form-status-badge" :class="form.active ? 'badge-active' : 'badge-draft'">
              {{ form.active ? 'Actif' : 'Brouillon' }}
            </span>
          </div>
          <h3 class="form-name">{{ form.name }}</h3>
          <div class="form-tags">
            <span class="tag tag-year"><CalendarDays class="h-3 w-3" /> {{ form.year }}</span>
            <span class="tag" :class="form.promoType === 'FIE' ? 'tag-fie' : 'tag-fia'">{{ form.promoType }}</span>
            <span class="tag tag-count"><ListChecks class="h-3 w-3" /> {{ form.questions.length }} questions</span>
          </div>
          <div class="form-card-actions">
            <button class="btn-editor" @click="openEditor(form)">
              <Pencil class="h-4 w-4" /> Gérer les questions
            </button>
            <button class="btn-preview" @click="openPreview(form)" title="Aperçu étudiant">
              <Eye class="h-4 w-4" />
            </button>
            <button class="btn-del" @click="deleteForm(form)" title="Supprimer">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button class="add-form-card" @click="openCreateForm">
          <Plus class="h-6 w-6" />
          <span>Nouveau questionnaire</span>
        </button>
      </div>
    </template>

    <!-- ════════════════ EDITOR VIEW ════════════════ -->
    <template v-if="view === 'editor'">
      <!-- Header -->
      <div class="page-header">
        <div class="flex-col-gap">
          <div class="breadcrumb">
            <button class="crumb" @click="view = 'list'"><ChevronLeft class="h-4 w-4" /> Questionnaires</button>
            <span class="crumb-sep">›</span>
            <span class="crumb crumb-active">{{ activeForm.name }}</span>
          </div>
          <div class="editor-meta">
            <span class="tag tag-year"><CalendarDays class="h-3 w-3" />{{ activeForm.year }}</span>
            <span class="tag" :class="activeForm.promoType === 'FIE' ? 'tag-fie' : 'tag-fia'">{{ activeForm.promoType }}</span>
            <span class="tag tag-count"><ListChecks class="h-3 w-3" /> {{ activeForm.questions.length }} questions</span>
          </div>
        </div>
        <div class="button-group">
          <button class="btn-secondary" @click="openPreview(activeForm)">
            <Eye class="h-4 w-4" /> Aperçu étudiant
          </button>
          <button class="btn-primary" @click="openAddQuestion">
            <Plus class="h-4 w-4" /> Ajouter une question
          </button>
        </div>
      </div>

      <!-- Excel Import -->
      <div
        class="drop-zone"
        :class="isDragging ? 'drop-zone--active' : ''"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div class="drop-icon" :class="isDragging ? 'drop-icon--active' : ''">
          <FileSpreadsheet class="h-7 w-7" />
        </div>
        <div class="drop-text">
          <p class="drop-title">Importer des questions via Excel / CSV</p>
          <p class="drop-sub">Colonnes attendues : Texte de la question, Type (Likert/QCM/Texte), Obligatoire (oui/non)</p>
        </div>
        <button class="btn-secondary btn-sm" @click="$refs.xlsInput.click()">Parcourir</button>
        <input ref="xlsInput" type="file" class="hidden" accept=".csv,.xlsx,.xls" @change="handleFileSelect" />
      </div>

      <!-- Question list -->
      <div class="questions-list">
        <div v-if="activeForm.questions.length === 0" class="empty-state">
          <MessageSquarePlus class="h-10 w-10" />
          <p>Aucune question. Ajoutez-en une ou importez depuis Excel.</p>
        </div>

        <div
          v-for="(q, idx) in activeForm.questions"
          :key="q.id"
          class="question-row"
        >
          <div class="q-num">{{ idx + 1 }}</div>
          <div class="q-body">
            <div class="q-header">
              <span class="q-type-badge" :class="typeBadgeClass(q.type)">{{ q.type }}</span>
              <span v-if="q.required" class="q-required">Obligatoire</span>
            </div>
            <p class="q-text">{{ q.text }}</p>
            <div v-if="q.type === 'QCM' && q.options" class="q-options">
              <span v-for="opt in q.options" :key="opt" class="q-option">{{ opt }}</span>
            </div>
            <div v-if="q.type === 'Likert'" class="q-likert-preview">
              <span v-for="l in likertLabels" :key="l" class="likert-chip">{{ l }}</span>
            </div>
          </div>
          <div class="q-actions">
            <button class="icon-btn icon-btn-edit" @click="openEditQuestion(q)"><Pencil class="h-4 w-4" /></button>
            <button class="icon-btn icon-btn-delete" @click="removeQuestion(q.id)"><Trash2 class="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </template>

    <!-- ════════════════ PREVIEW VIEW ════════════════ -->
    <template v-if="view === 'preview'">
      <div class="page-header">
        <div class="breadcrumb">
          <button class="crumb" @click="view = activeFormBeforePreview === 'list' ? 'list' : 'editor'">
            <ChevronLeft class="h-4 w-4" /> Retour
          </button>
          <span class="crumb-sep">›</span>
          <span class="crumb crumb-active">Aperçu — {{ activeForm.name }}</span>
        </div>
        <span class="preview-label"><Eye class="h-4 w-4" /> Vue étudiant</span>
      </div>
      <EvaluationFormShared :questions="activeForm.questions" :form-name="activeForm.name" preview-mode />
    </template>

    <!-- ════════════════ MODALS ════════════════ -->

    <!-- Create Form Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Nouveau questionnaire</h3>
          <button class="modal-close" @click="showCreateModal = false"><X class="h-5 w-5" /></button>
        </div>
        <form class="modal-body" @submit.prevent="saveNewForm">
          <div class="form-group">
            <label class="form-label">Nom du questionnaire</label>
            <input v-model="newForm.name" class="form-input" placeholder="ex: Évaluation FIE3 — S2 2025" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Année académique</label>
              <input v-model="newForm.year" class="form-input" placeholder="ex: 2024 - 2025" required />
            </div>
            <div class="form-group">
              <label class="form-label">Type de promotion</label>
              <div class="promo-toggle">
                <button
                  type="button"
                  class="promo-btn"
                  :class="newForm.promoType === 'FIE' ? 'promo-btn--active' : ''"
                  @click="newForm.promoType = 'FIE'"
                >FIE</button>
                <button
                  type="button"
                  class="promo-btn"
                  :class="newForm.promoType === 'FIA' ? 'promo-btn--active' : ''"
                  @click="newForm.promoType = 'FIA'"
                >FIA</button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Promotions concernées</label>
            <div class="promo-list">
              <label
                v-for="p in availablePromos"
                :key="p"
                class="promo-check"
                :class="newForm.promos.includes(p) ? 'promo-check--active' : ''"
              >
                <input type="checkbox" :value="p" v-model="newForm.promos" class="hidden" />
                {{ p }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Statut</label>
            <div class="promo-toggle">
              <button type="button" class="promo-btn" :class="newForm.active ? 'promo-btn--active' : ''" @click="newForm.active = true">Actif</button>
              <button type="button" class="promo-btn" :class="!newForm.active ? 'promo-btn--active' : ''" @click="newForm.active = false">Brouillon</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showCreateModal = false">Annuler</button>
            <button type="submit" class="btn-primary">Créer le questionnaire</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Question Modal -->
    <div v-if="showQModal" class="modal-overlay" @click.self="showQModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingQuestion ? 'Modifier la question' : 'Ajouter une question' }}</h3>
          <button class="modal-close" @click="showQModal = false"><X class="h-5 w-5" /></button>
        </div>
        <form class="modal-body" @submit.prevent="saveQuestion">
          <div class="form-group">
            <label class="form-label">Texte de la question</label>
            <textarea v-model="qForm.text" class="form-input form-textarea" placeholder="Saisissez votre question..." required rows="3" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Type de question</label>
              <select v-model="qForm.type" class="form-input">
                <option>Likert</option>
                <option>QCM</option>
                <option>Texte</option>
              </select>
            </div>
            <div class="form-group form-check">
              <input type="checkbox" id="reqCheck" v-model="qForm.required" class="checkbox" />
              <label for="reqCheck" class="form-label-inline">Obligatoire</label>
            </div>
          </div>
          <div v-if="qForm.type === 'QCM'" class="form-group">
            <label class="form-label">Options (une par ligne)</label>
            <textarea v-model="qForm.optionsText" class="form-input form-textarea" placeholder="Option A&#10;Option B&#10;Option C" rows="4" />
          </div>
          <div v-if="qForm.type === 'Likert'" class="form-group">
            <label class="form-label">Échelle utilisée</label>
            <div class="likert-preview-row">
              <span v-for="l in likertLabels" :key="l" class="likert-chip">{{ l }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showQModal = false">Annuler</button>
            <button type="submit" class="btn-primary">{{ editingQuestion ? 'Enregistrer' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  Plus, ClipboardList, Pencil, Trash2, Eye, X, ChevronLeft,
  CalendarDays, ListChecks, FileSpreadsheet, MessageSquarePlus
} from 'lucide-vue-next';
import EvaluationFormShared from '../../components/shared/EvaluationFormShared.vue';

// ─── VIEWS ──────────────────────────────────────────────
const view = ref('list'); // 'list' | 'editor' | 'preview'
const activeForm = ref(null);
const activeFormBeforePreview = ref('list');

// ─── DATA ────────────────────────────────────────────────
const likertLabels = ["Tout à fait d'accord", "Plutôt d'accord", "Plutôt pas d'accord", "Pas du tout d'accord", "Ne se prononce pas"];

const forms = ref([
  {
    id: 1, name: 'Évaluation Standard ISIS', year: '2024 - 2025', promoType: 'FIE',
    promos: ['FIE 1', 'FIE 2', 'FIE 3'], active: true,
    questions: [
      { id: 1, text: "Mon enseignant.e m'a communiqué les règles de fonctionnement du cours lors des premières séances.", type: 'Likert', required: true },
      { id: 2, text: "Le contenu du cours correspond aux objectifs pédagogiques annoncés.", type: 'Likert', required: true },
      { id: 3, text: "Les supports de cours mis à disposition sont clairs et pertinents.", type: 'Likert', required: true },
      { id: 4, text: "La charge de travail demandée est adaptée au niveau et à la durée du module.", type: 'Likert', required: true },
      { id: 5, text: "Globalement, je suis satisfait.e de la qualité de cet enseignement.", type: 'Likert', required: true },
      { id: 6, text: "Commentaires libres (points positifs, suggestions d'amélioration…)", type: 'Texte', required: false },
    ]
  },
  {
    id: 2, name: 'Évaluation FIA — Alternance', year: '2024 - 2025', promoType: 'FIA',
    promos: ['FIA 3', 'FIA 4'], active: true,
    questions: [
      { id: 1, text: "Le cours est bien adapté aux contraintes de l'alternance.", type: 'Likert', required: true },
      { id: 2, text: "L'enseignant.e prend en compte votre expérience professionnelle.", type: 'Likert', required: true },
      { id: 3, text: "Quel aspect du cours trouvez-vous le plus utile ?", type: 'QCM', required: false, options: ['Contenu théorique', 'Exercices pratiques', 'Études de cas', 'Autre'] },
    ]
  },
]);

// ─── NAVIGATION ──────────────────────────────────────────
function openEditor(form) { activeForm.value = form; view.value = 'editor'; }
function openPreview(form) {
  activeFormBeforePreview.value = view.value;
  activeForm.value = form;
  view.value = 'preview';
}

// ─── CREATE FORM ─────────────────────────────────────────
const showCreateModal = ref(false);
const newForm = ref({ name: '', year: '', promoType: 'FIE', promos: [], active: true });
const availablePromos = computed(() =>
  newForm.value.promoType === 'FIE'
    ? ['FIE 1', 'FIE 2', 'FIE 3', 'FIE 4', 'FIE 5']
    : ['FIA 3', 'FIA 4', 'FIA 5']
);
watch(() => newForm.value.promoType, () => { newForm.value.promos = []; });

function openCreateForm() {
  newForm.value = { name: '', year: '2024 - 2025', promoType: 'FIE', promos: [], active: true };
  showCreateModal.value = true;
}
function saveNewForm() {
  forms.value.push({ ...newForm.value, id: Date.now(), questions: [] });
  showCreateModal.value = false;
}
function deleteForm(form) {
  forms.value = forms.value.filter(f => f.id !== form.id);
  if (activeForm.value?.id === form.id) { activeForm.value = null; view.value = 'list'; }
}

// ─── QUESTION EDITOR ─────────────────────────────────────
const showQModal = ref(false);
const editingQuestion = ref(null);
const qForm = ref({ text: '', type: 'Likert', required: true, optionsText: '' });

function openAddQuestion() {
  editingQuestion.value = null;
  qForm.value = { text: '', type: 'Likert', required: true, optionsText: '' };
  showQModal.value = true;
}
function openEditQuestion(q) {
  editingQuestion.value = q;
  qForm.value = { ...q, optionsText: q.options ? q.options.join('\n') : '' };
  showQModal.value = true;
}
function saveQuestion() {
  const options = qForm.value.type === 'QCM'
    ? qForm.value.optionsText.split('\n').map(s => s.trim()).filter(Boolean)
    : undefined;
  const data = { text: qForm.value.text, type: qForm.value.type, required: qForm.value.required, options };
  if (editingQuestion.value) {
    const idx = activeForm.value.questions.findIndex(q => q.id === editingQuestion.value.id);
    if (idx !== -1) activeForm.value.questions[idx] = { ...data, id: editingQuestion.value.id };
  } else {
    activeForm.value.questions.push({ ...data, id: Date.now() });
  }
  showQModal.value = false;
}
function removeQuestion(id) {
  activeForm.value.questions = activeForm.value.questions.filter(q => q.id !== id);
}

// ─── IMPORT ──────────────────────────────────────────────
const isDragging = ref(false);
function handleDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) console.log('Import:', file.name);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) console.log('Import:', file.name);
}

// ─── HELPERS ─────────────────────────────────────────────
function typeBadgeClass(type) {
  return { Likert: 'type-likert', QCM: 'type-qcm', Texte: 'type-text' }[type] || '';
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-container { display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.35s ease-out; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.page-title { font-size: 1.25rem; font-weight: 700; color: #1c0845; }
.page-subtitle { font-size: 0.8rem; color: #5f527a; margin-top: 0.25rem; }
.flex-col-gap { display: flex; flex-direction: column; gap: 0.5rem; }
.editor-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.button-group { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 0.25rem; }
.crumb {
  display: flex; align-items: center; gap: 0.25rem;
  padding: 0.3rem 0.65rem; border-radius: 99px;
  font-size: 0.8rem; font-weight: 600; color: #5f527a;
  background: none; border: none; cursor: pointer;
  transition: all 0.15s ease;
}
.crumb:hover { background: #f3f0fa; color: #2f0d73; }
.crumb-active { color: #2f0d73; background: #ede9fe; cursor: default; }
.crumb-active:hover { background: #ede9fe; }
.crumb-sep { color: #c4b5d0; font-size: 1rem; }
.preview-label { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; font-weight: 600; color: #5f527a; }

/* Buttons */
.btn-primary {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.25rem; background: #2f0d73; color: white;
  border: none; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(47,13,115,0.2);
}
.btn-primary:hover { background: #1c0845; }

.btn-secondary {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.25rem; background: white; color: #2f0d73;
  border: 1px solid #2f0d73; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.btn-secondary:hover { background: #f5f3ff; }

.btn-sm { padding: 0.4rem 0.9rem; font-size: 0.8rem; }

/* Tags */
.tag {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.2rem 0.65rem; border-radius: 99px; font-size: 0.72rem; font-weight: 600;
}
.tag-year { background: #f1f5f9; color: #475569; }
.tag-fie  { background: #ede9fe; color: #2f0d73; }
.tag-fia  { background: #fff7ed; color: #c2410c; }
.tag-count { background: #f0fdf4; color: #15803d; }

/* Forms grid */
.forms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.form-card {
  background: white; border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;
  transition: all 0.2s ease;
}
.form-card:hover { border-color: #7c3aed; box-shadow: 0 4px 16px rgba(124,58,237,0.1); }

.form-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.form-icon { width: 2.5rem; height: 2.5rem; background: #f3e8ff; color: #7c3aed; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.form-status-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.2rem 0.65rem; border-radius: 99px; }
.badge-active { background: #dcfce7; color: #15803d; }
.badge-draft  { background: #fef9c3; color: #92400e; }

.form-name { font-size: 1rem; font-weight: 700; color: #1c0845; }
.form-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.form-card-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.btn-editor {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.55rem; background: #2f0d73; color: white; border: none;
  border-radius: 0.65rem; font-size: 0.8rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.btn-editor:hover { background: #1c0845; }
.btn-preview {
  display: flex; align-items: center; justify-content: center;
  width: 2.25rem; height: 2.25rem; background: #ede9fe; color: #2f0d73;
  border: none; border-radius: 0.65rem; cursor: pointer; transition: all 0.15s ease;
}
.btn-preview:hover { background: #2f0d73; color: white; }
.btn-del {
  display: flex; align-items: center; justify-content: center;
  width: 2.25rem; height: 2.25rem; background: #fee2e2; color: #dc2626;
  border: none; border-radius: 0.65rem; cursor: pointer; transition: all 0.15s ease;
}
.btn-del:hover { background: #dc2626; color: white; }

.add-form-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
  border: 2px dashed rgba(124,58,237,0.25); border-radius: 1.25rem;
  background: transparent; color: #7c3aed; font-size: 0.85rem; font-weight: 600;
  min-height: 160px; cursor: pointer; transition: all 0.2s ease;
}
.add-form-card:hover { border-color: #7c3aed; background: rgba(124,58,237,0.04); }

/* Drop zone */
.drop-zone {
  display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
  border: 2px dashed rgba(124,58,237,0.25); border-radius: 1rem;
  padding: 1.25rem 1.5rem; background: white;
  transition: all 0.2s ease;
}
.drop-zone:hover { border-color: rgba(124,58,237,0.5); }
.drop-zone--active { border-color: #7c3aed; background: #f5f3ff; }
.drop-icon {
  width: 3rem; height: 3rem; border-radius: 0.75rem;
  background: #ede9fe; color: #7c3aed;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.2s ease;
}
.drop-icon--active { background: #7c3aed; color: white; }
.drop-text { flex: 1; min-width: 200px; }
.drop-title { font-size: 0.9rem; font-weight: 700; color: #1c0845; }
.drop-sub { font-size: 0.75rem; color: #5f527a; margin-top: 0.2rem; }
.hidden { display: none; }

/* Question rows */
.questions-list { display: flex; flex-direction: column; gap: 0.75rem; }

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem; padding: 3rem; color: #9ca3af;
  background: white; border-radius: 1.25rem;
  border: 2px dashed rgba(228,224,235,0.8); font-size: 0.875rem;
}

.question-row {
  display: flex; align-items: flex-start; gap: 1rem;
  background: white; border-radius: 1rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  padding: 1rem 1.25rem;
  transition: all 0.15s ease;
}
.question-row:hover { border-color: #c4b5fd; }

.q-num {
  width: 1.75rem; height: 1.75rem; border-radius: 50%;
  background: #ede9fe; color: #2f0d73;
  font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 0.125rem;
}

.q-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.q-header { display: flex; align-items: center; gap: 0.5rem; }

.q-type-badge { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.55rem; border-radius: 4px; text-transform: uppercase; }
.type-likert { background: #ede9fe; color: #5b21b6; }
.type-qcm    { background: #dbeafe; color: #1d4ed8; }
.type-text   { background: #dcfce7; color: #15803d; }

.q-required { font-size: 0.65rem; color: #ef4444; font-weight: 700; }
.q-text { font-size: 0.875rem; color: #1c0845; font-weight: 500; line-height: 1.5; }

.q-options { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.q-option { font-size: 0.72rem; background: #f1f5f9; color: #475569; padding: 0.2rem 0.6rem; border-radius: 99px; }

.q-likert-preview { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.likert-chip { font-size: 0.65rem; background: #f5f3ff; color: #5b21b6; padding: 0.2rem 0.55rem; border-radius: 4px; font-weight: 600; }

.q-actions { display: flex; gap: 0.375rem; flex-shrink: 0; }
.icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 1.875rem; height: 1.875rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.15s ease; }
.icon-btn-edit { background: #ede9fe; color: #2f0d73; }
.icon-btn-edit:hover { background: #2f0d73; color: white; }
.icon-btn-delete { background: #fee2e2; color: #dc2626; }
.icon-btn-delete:hover { background: #dc2626; color: white; }

/* Likert preview in modal */
.likert-preview-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(28,8,69,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem;
}
.modal { background: white; border-radius: 1.5rem; width: 100%; max-width: 540px; box-shadow: 0 20px 60px rgba(47,13,115,0.2); animation: fadeIn 0.2s ease-out; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.5rem 0; }
.modal-title { font-size: 1.1rem; font-weight: 700; color: #1c0845; }
.modal-close { background: none; border: none; color: #5f527a; cursor: pointer; padding: 0.25rem; border-radius: 0.5rem; display: flex; align-items: center; transition: all 0.15s ease; }
.modal-close:hover { background: #f3f4f6; color: #1c0845; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 0 1.5rem 1.5rem; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-check { flex-direction: row; align-items: center; gap: 0.5rem; justify-content: flex-start; padding-top: 1.5rem; }
.form-label { font-size: 0.72rem; font-weight: 700; color: #5f527a; text-transform: uppercase; letter-spacing: 0.04em; }
.form-label-inline { font-size: 0.875rem; font-weight: 500; color: #1c0845; text-transform: none; letter-spacing: 0; }
.form-input { padding: 0.625rem 0.875rem; border: 1px solid #e4e0eb; border-radius: 0.75rem; font-size: 0.875rem; color: #1c0845; outline: none; background: #f8f7fa; transition: all 0.2s ease; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124,58,237,0.15); background: white; }
.form-textarea { resize: vertical; min-height: 80px; }
.checkbox { width: 1rem; height: 1rem; accent-color: #2f0d73; cursor: pointer; }

/* Promo type toggle */
.promo-toggle { display: flex; border: 1px solid #e4e0eb; border-radius: 0.75rem; overflow: hidden; }
.promo-btn { flex: 1; padding: 0.55rem; border: none; background: #f8f7fa; color: #5f527a; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
.promo-btn--active { background: #2f0d73; color: white; }

/* Promo list checkboxes styled as chips */
.promo-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.promo-check {
  padding: 0.3rem 0.75rem; border-radius: 99px;
  font-size: 0.78rem; font-weight: 600; cursor: pointer;
  border: 1px solid #e4e0eb; color: #5f527a; background: #f8f7fa;
  transition: all 0.15s ease; user-select: none;
}
.promo-check--active { border-color: #2f0d73; color: #2f0d73; background: #ede9fe; }
</style>
