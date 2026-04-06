<template>
  <div class="page-container">

    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <button class="crumb" :class="{ 'crumb-active': view === 'years' }" @click="goToYears">
        <GraduationCap class="h-4 w-4" />
        Années académiques
      </button>
      <template v-if="selectedYear">
        <ChevronRight class="crumb-sep" />
        <button class="crumb" :class="{ 'crumb-active': view === 'semesters' }" @click="goToSemesters">
          {{ selectedYear.label }}
        </button>
      </template>
      <template v-if="selectedSemester">
        <ChevronRight class="crumb-sep" />
        <button class="crumb" :class="{ 'crumb-active': view === 'modules' }" @click="goToModules">
          {{ selectedSemester.label }}
        </button>
      </template>
      <template v-if="selectedModule">
        <ChevronRight class="crumb-sep" />
        <span class="crumb crumb-active">{{ selectedModule.name }}</span>
      </template>
    </nav>

    <!-- ────────────── YEARS ────────────── -->
    <template v-if="view === 'years'">
      <div class="page-header">
        <div>
          <h2 class="page-title">Années académiques</h2>
          <p class="page-subtitle">{{ years.length }} année(s) configurée(s)</p>
        </div>
        <button class="btn-primary" @click="openAdd('year')">
          <Plus class="h-4 w-4" /> Ajouter une année
        </button>
      </div>

      <div class="cards-grid">
        <div
          v-for="year in years"
          :key="year.id"
          class="year-card"
          :class="year.current ? 'year-card--current' : ''"
          @click="selectYear(year)"
        >
          <div class="year-card-top">
            <div class="year-icon">
              <CalendarDays class="h-6 w-6" />
            </div>
            <span v-if="year.current" class="badge-current">En cours</span>
          </div>
          <h3 class="year-label">{{ year.label }}</h3>
          <p class="year-meta">{{ semestersOf(year.id).length }} semestre(s) · {{ modulesCount(year.id) }} module(s)</p>
          <div class="card-actions" @click.stop>
            <button class="icon-btn icon-btn-edit" @click="openEdit('year', year)" title="Modifier"><Pencil class="h-4 w-4" /></button>
            <button class="icon-btn icon-btn-delete" @click="openDelete('year', year)" title="Supprimer"><Trash2 class="h-4 w-4" /></button>
          </div>
          <div class="card-arrow">
            <ChevronRight class="h-5 w-5" />
          </div>
        </div>

        <button class="add-card" @click="openAdd('year')">
          <Plus class="h-6 w-6" />
          <span>Nouvelle année</span>
        </button>
      </div>
    </template>

    <!-- ────────────── SEMESTERS ────────────── -->
    <template v-if="view === 'semesters'">
      <div class="page-header">
        <div>
          <h2 class="page-title">Semestres — {{ selectedYear.label }}</h2>
          <p class="page-subtitle">{{ semestersOf(selectedYear.id).length }} semestre(s)</p>
        </div>
        <div class="button-group">
          <button class="btn-secondary" @click="goToYears">
            <ArrowLeft class="h-4 w-4" /> Retour
          </button>
          <button class="btn-primary" @click="openAdd('semester')">
            <Plus class="h-4 w-4" /> Ajouter un semestre
          </button>
        </div>
      </div>

      <div class="cards-grid">
        <div
          v-for="sem in semestersOf(selectedYear.id)"
          :key="sem.id"
          class="semester-card"
          @click="selectSemester(sem)"
        >
          <div class="sem-header">
            <div class="sem-icon">
              <Layers class="h-5 w-5" />
            </div>
            <span class="sem-num">{{ sem.label }}</span>
          </div>
          <p class="sem-dates">{{ sem.startDate }} → {{ sem.endDate }}</p>
          <p class="sem-meta">{{ modulesOf(sem.id).length }} module(s) · {{ coursesCountSemester(sem.id) }} cours</p>
          <div class="status-row">
            <span class="status-badge" :class="sem.status === 'Actif' ? 'status-active' : sem.status === 'Terminé' ? 'status-done' : 'status-planned'">
              {{ sem.status }}
            </span>
          </div>
          <div class="card-actions" @click.stop>
            <button class="icon-btn icon-btn-edit" @click="openEdit('semester', sem)"><Pencil class="h-4 w-4" /></button>
            <button class="icon-btn icon-btn-delete" @click="openDelete('semester', sem)"><Trash2 class="h-4 w-4" /></button>
          </div>
          <div class="card-arrow"><ChevronRight class="h-5 w-5" /></div>
        </div>

        <button class="add-card" @click="openAdd('semester')">
          <Plus class="h-6 w-6" />
          <span>Nouveau semestre</span>
        </button>
      </div>
    </template>

    <!-- ────────────── MODULES ────────────── -->
    <template v-if="view === 'modules'">
      <div class="page-header">
        <div>
          <h2 class="page-title">Modules — {{ selectedSemester.label }}</h2>
          <p class="page-subtitle">{{ modulesOf(selectedSemester.id).length }} module(s)</p>
        </div>
        <div class="button-group">
          <button class="btn-secondary" @click="goToSemesters">
            <ArrowLeft class="h-4 w-4" /> Retour
          </button>
          <button class="btn-primary" @click="openAdd('module')">
            <Plus class="h-4 w-4" /> Ajouter un module
          </button>
        </div>
      </div>

      <div class="table-card">
        <table class="table">
          <thead class="table-head">
            <tr>
              <th class="th">Module</th>
              <th class="th">Code</th>
              <th class="th">Responsable</th>
              <th class="th">Cours</th>
              <th class="th">Crédits</th>
              <th class="th th-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mod in modulesOf(selectedSemester.id)" :key="mod.id" class="tr" @click="selectModule(mod)">
              <td class="td">
                <div class="module-cell">
                  <div class="module-icon">
                    <BookOpen class="h-4 w-4" />
                  </div>
                  <div>
                    <p class="module-name">{{ mod.name }}</p>
                    <p class="module-ue">{{ mod.ue }}</p>
                  </div>
                </div>
              </td>
              <td class="td td-code">{{ mod.code }}</td>
              <td class="td td-secondary">{{ mod.teacher }}</td>
              <td class="td">
                <span class="count-badge">{{ coursesOf(mod.id).length }} cours</span>
              </td>
              <td class="td td-secondary">{{ mod.credits }} ECTS</td>
              <td class="td td-center" @click.stop>
                <button class="icon-btn icon-btn-edit" @click="openEdit('module', mod)"><Pencil class="h-4 w-4" /></button>
                <button class="icon-btn icon-btn-delete ml-1" @click="openDelete('module', mod)"><Trash2 class="h-4 w-4" /></button>
              </td>
            </tr>
            <tr v-if="modulesOf(selectedSemester.id).length === 0">
              <td colspan="6" class="td-empty">Aucun module. Cliquez sur "Ajouter un module".</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ────────────── COURSES ────────────── -->
    <template v-if="view === 'courses'">
      <div class="page-header">
        <div>
          <h2 class="page-title">Cours — {{ selectedModule.name }}</h2>
          <p class="page-subtitle">{{ selectedModule.code }} · {{ selectedModule.ue }} · {{ coursesOf(selectedModule.id).length }} cours</p>
        </div>
        <div class="button-group">
          <button class="btn-secondary" @click="goToModules">
            <ArrowLeft class="h-4 w-4" /> Retour
          </button>
          <button class="btn-primary" @click="openAdd('course')">
            <Plus class="h-4 w-4" /> Ajouter un cours
          </button>
        </div>
      </div>

      <!-- Module info strip -->
      <div class="module-info-strip">
        <div class="info-chip"><Users class="h-4 w-4" /> Responsable : <strong>{{ selectedModule.teacher }}</strong></div>
        <div class="info-chip"><Award class="h-4 w-4" /> Crédits : <strong>{{ selectedModule.credits }} ECTS</strong></div>
        <div class="info-chip"><BookOpen class="h-4 w-4" /> UE : <strong>{{ selectedModule.ue }}</strong></div>
      </div>

      <div class="courses-list">
        <div v-for="course in coursesOf(selectedModule.id)" :key="course.id" class="course-row">
          <div class="course-left">
            <div class="course-num">{{ course.num }}</div>
            <div class="course-info">
              <p class="course-title">{{ course.title }}</p>
              <div class="course-meta">
                <span class="course-type-badge" :class="'type-' + course.type.toLowerCase()">{{ course.type }}</span>
                <span class="course-dot">·</span>
                <span class="course-detail">{{ course.duration }}h</span>
                <span class="course-dot">·</span>
                <span class="course-detail">{{ course.teacher }}</span>
              </div>
            </div>
          </div>
          <div class="course-right">
            <span class="course-date">{{ course.date }}</span>
            <button class="icon-btn icon-btn-edit" @click="openEdit('course', course)"><Pencil class="h-4 w-4" /></button>
            <button class="icon-btn icon-btn-delete" @click="openDelete('course', course)"><Trash2 class="h-4 w-4" /></button>
          </div>
        </div>

        <button class="add-course-btn" @click="openAdd('course')">
          <Plus class="h-4 w-4" /> Ajouter un cours
        </button>
      </div>
    </template>

    <!-- ────────────── MODALS ────────────── -->

    <!-- Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ formTitle }}</h3>
          <button class="modal-close" @click="showForm = false"><X class="h-5 w-5" /></button>
        </div>

        <form class="modal-body" @submit.prevent="saveForm">

          <!-- Year form -->
          <template v-if="formType === 'year'">
            <div class="form-group">
              <label class="form-label">Intitulé de l'année</label>
              <input v-model="form.label" class="form-input" placeholder="ex: 2024 - 2025" required />
            </div>
            <div class="form-group form-check">
              <input type="checkbox" id="current" v-model="form.current" class="checkbox" />
              <label for="current" class="form-label-inline">Année en cours</label>
            </div>
          </template>

          <!-- Semester form -->
          <template v-if="formType === 'semester'">
            <div class="form-group">
              <label class="form-label">Intitulé</label>
              <input v-model="form.label" class="form-input" placeholder="ex: Semestre 1" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date de début</label>
                <input v-model="form.startDate" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Date de fin</label>
                <input v-model="form.endDate" type="date" class="form-input" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Statut</label>
              <select v-model="form.status" class="form-input">
                <option>Planifié</option>
                <option>Actif</option>
                <option>Terminé</option>
              </select>
            </div>
          </template>

          <!-- Module form -->
          <template v-if="formType === 'module'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nom du module</label>
                <input v-model="form.name" class="form-input" placeholder="ex: POO Java" required />
              </div>
              <div class="form-group">
                <label class="form-label">Code</label>
                <input v-model="form.code" class="form-input" placeholder="ex: INF501" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Unité d'enseignement (UE)</label>
                <input v-model="form.ue" class="form-input" placeholder="ex: UE Informatique" />
              </div>
              <div class="form-group">
                <label class="form-label">Crédits ECTS</label>
                <input v-model.number="form.credits" type="number" min="1" max="30" class="form-input" placeholder="3" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Enseignant responsable</label>
              <input v-model="form.teacher" class="form-input" placeholder="ex: Dr. Martin" />
            </div>
          </template>

          <!-- Course form -->
          <template v-if="formType === 'course'">
            <div class="form-group">
              <label class="form-label">Titre du cours</label>
              <input v-model="form.title" class="form-input" placeholder="ex: Introduction à la POO" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select v-model="form.type" class="form-input">
                  <option>CM</option>
                  <option>TD</option>
                  <option>TP</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Durée (h)</label>
                <input v-model.number="form.duration" type="number" min="1" class="form-input" placeholder="2" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Enseignant</label>
                <input v-model="form.teacher" class="form-input" placeholder="ex: Dr. Martin" />
              </div>
              <div class="form-group">
                <label class="form-label">Date</label>
                <input v-model="form.date" type="date" class="form-input" />
              </div>
            </div>
          </template>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showForm = false">Annuler</button>
            <button type="submit" class="btn-primary">{{ editingItem ? 'Enregistrer' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDelete" class="modal-overlay" @click.self="showDelete = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3 class="modal-title">Confirmer la suppression</h3>
          <button class="modal-close" @click="showDelete = false"><X class="h-5 w-5" /></button>
        </div>
        <div class="modal-body">
          <p class="delete-text">Voulez-vous vraiment supprimer <strong>{{ deleteTarget?.label || deleteTarget?.name || deleteTarget?.title }}</strong> ? Cette action est irréversible.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDelete = false">Annuler</button>
          <button class="btn-danger" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  GraduationCap, ChevronRight, Plus, Pencil, Trash2, X,
  CalendarDays, Layers, BookOpen, ArrowLeft, Users, Award
} from 'lucide-vue-next';

// ─── STATE ───────────────────────────────────────────────
const view = ref('years');
const selectedYear = ref(null);
const selectedSemester = ref(null);
const selectedModule = ref(null);

// ─── DATA ────────────────────────────────────────────────
const years = ref([
  { id: 1, label: '2023 - 2024', current: false },
  { id: 2, label: '2024 - 2025', current: true },
]);

const semesters = ref([
  { id: 101, yearId: 1, label: 'Semestre 1', startDate: '2023-09-04', endDate: '2024-01-19', status: 'Terminé' },
  { id: 102, yearId: 1, label: 'Semestre 2', startDate: '2024-01-22', endDate: '2024-06-14', status: 'Terminé' },
  { id: 103, yearId: 2, label: 'Semestre 1', startDate: '2024-09-02', endDate: '2025-01-17', status: 'Terminé' },
  { id: 104, yearId: 2, label: 'Semestre 2', startDate: '2025-01-20', endDate: '2025-06-13', status: 'Actif' },
]);

const modules = ref([
  { id: 201, semesterId: 103, code: 'INF501', name: 'POO Java', ue: 'UE Informatique', teacher: 'Dr. Fontaine', credits: 4 },
  { id: 202, semesterId: 103, code: 'MAT501', name: 'Mathématiques Appliquées', ue: 'UE Fondamentaux', teacher: 'Mme. Leblanc', credits: 5 },
  { id: 203, semesterId: 103, code: 'LAN501', name: 'Anglais Technique', ue: 'UE Langues', teacher: 'M. Rousseau', credits: 2 },
  { id: 204, semesterId: 104, code: 'INF502', name: 'Base de Données', ue: 'UE Informatique', teacher: 'Dr. Petit', credits: 4 },
  { id: 205, semesterId: 104, code: 'INF503', name: 'Réseaux IP', ue: 'UE Réseaux', teacher: 'M. Chevalier', credits: 3 },
  { id: 206, semesterId: 104, code: 'MGT501', name: 'Gestion de Projet', ue: 'UE Management', teacher: 'Mme. Garnier', credits: 3 },
]);

const courses = ref([
  { id: 301, moduleId: 201, num: '01', title: 'Introduction à la POO', type: 'CM', duration: 2, teacher: 'Dr. Fontaine', date: '2024-09-09' },
  { id: 302, moduleId: 201, num: '02', title: 'Classes et Objets', type: 'CM', duration: 2, teacher: 'Dr. Fontaine', date: '2024-09-16' },
  { id: 303, moduleId: 201, num: '03', title: 'TP — Premiers pas Java', type: 'TP', duration: 3, teacher: 'Dr. Fontaine', date: '2024-09-23' },
  { id: 304, moduleId: 201, num: '04', title: 'Héritage & Polymorphisme', type: 'CM', duration: 2, teacher: 'Dr. Fontaine', date: '2024-09-30' },
  { id: 305, moduleId: 202, num: '01', title: 'Algèbre linéaire — révisions', type: 'CM', duration: 2, teacher: 'Mme. Leblanc', date: '2024-09-10' },
  { id: 306, moduleId: 202, num: '02', title: 'TD — Systèmes d\'équations', type: 'TD', duration: 2, teacher: 'Mme. Leblanc', date: '2024-09-17' },
  { id: 307, moduleId: 204, num: '01', title: 'Modèle Entité-Association', type: 'CM', duration: 2, teacher: 'Dr. Petit', date: '2025-01-27' },
  { id: 308, moduleId: 204, num: '02', title: 'SQL — Fondamentaux', type: 'CM', duration: 2, teacher: 'Dr. Petit', date: '2025-02-03' },
  { id: 309, moduleId: 204, num: '03', title: 'TP — Requêtes SQL', type: 'TP', duration: 3, teacher: 'Dr. Petit', date: '2025-02-10' },
]);

// ─── COMPUTED HELPERS ─────────────────────────────────────
function semestersOf(yearId) { return semesters.value.filter(s => s.yearId === yearId); }
function modulesOf(semesterId) { return modules.value.filter(m => m.semesterId === semesterId); }
function coursesOf(moduleId) { return courses.value.filter(c => c.moduleId === moduleId); }
function modulesCount(yearId) {
  const semIds = semestersOf(yearId).map(s => s.id);
  return modules.value.filter(m => semIds.includes(m.semesterId)).length;
}
function coursesCountSemester(semesterId) {
  const modIds = modulesOf(semesterId).map(m => m.id);
  return courses.value.filter(c => modIds.includes(c.moduleId)).length;
}

// ─── NAVIGATION ──────────────────────────────────────────
function goToYears() { view.value = 'years'; selectedYear.value = null; selectedSemester.value = null; selectedModule.value = null; }
function goToSemesters() { view.value = 'semesters'; selectedSemester.value = null; selectedModule.value = null; }
function goToModules() { view.value = 'modules'; selectedModule.value = null; }

function selectYear(year) { selectedYear.value = year; view.value = 'semesters'; }
function selectSemester(sem) { selectedSemester.value = sem; view.value = 'modules'; }
function selectModule(mod) { selectedModule.value = mod; view.value = 'courses'; }

// ─── FORM ────────────────────────────────────────────────
const showForm = ref(false);
const formType = ref('');
const editingItem = ref(null);
const form = ref({});

const formTitle = computed(() => {
  const action = editingItem.value ? 'Modifier' : 'Ajouter';
  const labels = { year: 'une année', semester: 'un semestre', module: 'un module', course: 'un cours' };
  return `${action} ${labels[formType.value] || ''}`;
});

function openAdd(type) {
  formType.value = type;
  editingItem.value = null;
  const defaults = {
    year:     { label: '', current: false },
    semester: { label: '', startDate: '', endDate: '', status: 'Planifié' },
    module:   { name: '', code: '', ue: '', teacher: '', credits: 3 },
    course:   { title: '', type: 'CM', duration: 2, teacher: '', date: '' },
  };
  form.value = { ...defaults[type] };
  showForm.value = true;
}

function openEdit(type, item) {
  formType.value = type;
  editingItem.value = item;
  form.value = { ...item };
  showForm.value = true;
}

function saveForm() {
  const nextId = () => Date.now();
  if (formType.value === 'year') {
    if (editingItem.value) {
      const i = years.value.findIndex(x => x.id === editingItem.value.id);
      if (i !== -1) years.value[i] = { ...form.value, id: editingItem.value.id };
    } else {
      years.value.push({ ...form.value, id: nextId() });
    }
  } else if (formType.value === 'semester') {
    if (editingItem.value) {
      const i = semesters.value.findIndex(x => x.id === editingItem.value.id);
      if (i !== -1) semesters.value[i] = { ...form.value, id: editingItem.value.id, yearId: selectedYear.value.id };
    } else {
      semesters.value.push({ ...form.value, id: nextId(), yearId: selectedYear.value.id });
    }
  } else if (formType.value === 'module') {
    if (editingItem.value) {
      const i = modules.value.findIndex(x => x.id === editingItem.value.id);
      if (i !== -1) modules.value[i] = { ...form.value, id: editingItem.value.id, semesterId: selectedSemester.value.id };
    } else {
      modules.value.push({ ...form.value, id: nextId(), semesterId: selectedSemester.value.id });
    }
  } else if (formType.value === 'course') {
    const count = coursesOf(selectedModule.value.id).length;
    const num = String(count + 1).padStart(2, '0');
    if (editingItem.value) {
      const i = courses.value.findIndex(x => x.id === editingItem.value.id);
      if (i !== -1) courses.value[i] = { ...form.value, id: editingItem.value.id, moduleId: selectedModule.value.id };
    } else {
      courses.value.push({ ...form.value, id: nextId(), num, moduleId: selectedModule.value.id });
    }
  }
  showForm.value = false;
}

// ─── DELETE ──────────────────────────────────────────────
const showDelete = ref(false);
const deleteType = ref('');
const deleteTarget = ref(null);

function openDelete(type, item) {
  deleteType.value = type;
  deleteTarget.value = item;
  showDelete.value = true;
}

function confirmDelete() {
  if (deleteType.value === 'year') years.value = years.value.filter(x => x.id !== deleteTarget.value.id);
  else if (deleteType.value === 'semester') semesters.value = semesters.value.filter(x => x.id !== deleteTarget.value.id);
  else if (deleteType.value === 'module') modules.value = modules.value.filter(x => x.id !== deleteTarget.value.id);
  else if (deleteType.value === 'course') courses.value = courses.value.filter(x => x.id !== deleteTarget.value.id);
  showDelete.value = false;
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.35s ease-out;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #5f527a;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.crumb:hover { background-color: #f3f0fa; color: #2f0d73; }
.crumb-active { color: #2f0d73; background-color: #ede9fe; cursor: default; }
.crumb-active:hover { background-color: #ede9fe; }

.crumb-sep {
  width: 1rem;
  height: 1rem;
  color: #c4b5d0;
  flex-shrink: 0;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c0845;
}

.page-subtitle {
  font-size: 0.8rem;
  color: #5f527a;
  margin-top: 0.25rem;
}

.button-group { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }

.btn-primary {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: #2f0d73; color: white;
  border: none; border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(47,13,115,0.2);
}
.btn-primary:hover { background-color: #1c0845; }
.btn-primary:active { transform: scale(0.97); }

.btn-secondary {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: white; color: #2f0d73;
  border: 1px solid #2f0d73; border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover { background-color: #f5f3ff; }

.btn-danger {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: #ef4444; color: white;
  border: none; border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger:hover { background-color: #dc2626; }

/* Year cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.year-card {
  position: relative;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}
.year-card:hover { border-color: #7c3aed; box-shadow: 0 4px 16px rgba(124,58,237,0.1); transform: translateY(-2px); }
.year-card--current { border-color: #2f0d73; background: linear-gradient(135deg, #2f0d73 0%, #4c1d9a 100%); color: white; }
.year-card--current .year-label { color: white; }
.year-card--current .year-meta { color: rgba(255,255,255,0.7); }
.year-card--current .year-icon { background: rgba(255,255,255,0.15); color: white; }
.year-card--current .card-arrow { color: rgba(255,255,255,0.7); }

.year-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.year-icon {
  width: 2.5rem; height: 2.5rem;
  background: #ede9fe; color: #2f0d73;
  border-radius: 0.75rem;
  display: flex; align-items: center; justify-content: center;
}

.badge-current {
  font-size: 0.65rem; font-weight: 700;
  padding: 0.2rem 0.6rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 99px; color: white;
}

.year-label { font-size: 1.1rem; font-weight: 700; color: #1c0845; margin-bottom: 0.25rem; }
.year-meta { font-size: 0.75rem; color: #5f527a; margin-bottom: 1rem; }

.card-actions {
  display: flex; gap: 0.375rem;
  opacity: 0; transition: opacity 0.15s ease;
  position: absolute; top: 1rem; right: 2.5rem;
}
.year-card:hover .card-actions,
.semester-card:hover .card-actions { opacity: 1; }

.card-arrow {
  position: absolute; right: 1rem; bottom: 1.5rem;
  color: #c4b5d0;
  transition: transform 0.15s ease;
}
.year-card:hover .card-arrow,
.semester-card:hover .card-arrow { transform: translateX(3px); color: #7c3aed; }
.year-card--current .card-arrow { color: rgba(255,255,255,0.5); }
.year-card--current:hover .card-arrow { color: white; }

/* Semester cards */
.semester-card {
  position: relative;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.6);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}
.semester-card:hover { border-color: #7c3aed; box-shadow: 0 4px 16px rgba(124,58,237,0.1); transform: translateY(-2px); }

.sem-header {
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
}

.sem-icon {
  width: 2.25rem; height: 2.25rem;
  background: #ede9fe; color: #2f0d73;
  border-radius: 0.75rem;
  display: flex; align-items: center; justify-content: center;
}

.sem-num { font-size: 1rem; font-weight: 700; color: #1c0845; }
.sem-dates { font-size: 0.75rem; color: #5f527a; margin-bottom: 0.25rem; }
.sem-meta { font-size: 0.75rem; color: #5f527a; margin-bottom: 0.75rem; }

.status-row { margin-bottom: 1.5rem; }

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 99px;
  font-size: 0.7rem; font-weight: 600;
}
.status-active  { background: #dcfce7; color: #16a34a; }
.status-done    { background: #e0e7ff; color: #4338ca; }
.status-planned { background: #fef9c3; color: #92400e; }

/* Add card button */
.add-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.5rem;
  border: 2px dashed rgba(124,58,237,0.25);
  border-radius: 1.25rem;
  background: transparent;
  color: #7c3aed;
  font-size: 0.85rem; font-weight: 600;
  cursor: pointer;
  min-height: 140px;
  transition: all 0.2s ease;
}
.add-card:hover { border-color: #7c3aed; background: rgba(124,58,237,0.04); }

/* Icon buttons */
.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.875rem; height: 1.875rem;
  border-radius: 0.5rem; border: none; cursor: pointer;
  transition: all 0.15s ease;
}
.icon-btn-edit { background: #ede9fe; color: #2f0d73; }
.icon-btn-edit:hover { background: #2f0d73; color: white; }
.icon-btn-delete { background: #fee2e2; color: #dc2626; }
.icon-btn-delete:hover { background: #dc2626; color: white; }
.ml-1 { margin-left: 0.25rem; }

/* Table (modules) */
.table-card {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}
.table { width: 100%; border-collapse: collapse; }
.table-head { background: #f8f7fa; border-bottom: 1px solid rgba(228,224,235,0.7); }
.th {
  padding: 0.875rem 1.25rem; text-align: left;
  font-size: 0.7rem; font-weight: 700; color: #5f527a;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.th-center { text-align: center; }
.tr {
  border-bottom: 1px solid rgba(228,224,235,0.4);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.tr:last-child { border-bottom: none; }
.tr:hover { background-color: #f5f3ff; }
.td { padding: 1rem 1.25rem; font-size: 0.875rem; vertical-align: middle; }
.td-center { text-align: center; }
.td-secondary { color: #5f527a; font-size: 0.8rem; }
.td-code { font-size: 0.75rem; font-weight: 700; color: #7c3aed; letter-spacing: 0.04em; }
.td-empty { padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }

.module-cell { display: flex; align-items: center; gap: 0.75rem; }
.module-icon {
  width: 2rem; height: 2rem;
  background: #ede9fe; color: #2f0d73;
  border-radius: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.module-name { font-weight: 600; color: #1c0845; }
.module-ue { font-size: 0.7rem; color: #9ca3af; margin-top: 0.1rem; }

.count-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  background: #f1f5f9; color: #475569;
  border-radius: 99px; font-size: 0.72rem; font-weight: 600;
}

/* Course list */
.module-info-strip {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.info-chip {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.8rem; color: #5f527a;
}
.info-chip strong { color: #1c0845; }

.courses-list {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.course-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(228,224,235,0.4);
  transition: background-color 0.15s ease;
  gap: 1rem;
}
.course-row:last-of-type { border-bottom: none; }
.course-row:hover { background-color: #f8f7fa; }

.course-left { display: flex; align-items: center; gap: 1rem; }
.course-num {
  width: 2rem; height: 2rem; border-radius: 50%;
  background: #ede9fe; color: #2f0d73;
  font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.course-title { font-weight: 600; color: #1c0845; font-size: 0.875rem; }
.course-meta { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; }
.course-type-badge {
  font-size: 0.65rem; font-weight: 700;
  padding: 0.15rem 0.5rem; border-radius: 4px;
  text-transform: uppercase;
}
.type-cm { background: #dbeafe; color: #1d4ed8; }
.type-td { background: #dcfce7; color: #15803d; }
.type-tp { background: #ffedd5; color: #c2410c; }
.course-dot { color: #d1d5db; }
.course-detail { font-size: 0.75rem; color: #5f527a; }

.course-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.course-date { font-size: 0.75rem; color: #9ca3af; margin-right: 0.5rem; }

.add-course-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; padding: 1rem;
  background: none; border: none;
  border-top: 2px dashed rgba(124,58,237,0.2);
  color: #7c3aed; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.add-course-btn:hover { background-color: rgba(124,58,237,0.04); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(28,8,69,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal {
  background: white; border-radius: 1.5rem;
  width: 100%; max-width: 520px;
  box-shadow: 0 20px 60px rgba(47,13,115,0.2);
  animation: fadeIn 0.2s ease-out;
}
.modal-sm { max-width: 400px; }

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 1.5rem 0;
}
.modal-title { font-size: 1.1rem; font-weight: 700; color: #1c0845; }
.modal-close {
  background: none; border: none; color: #5f527a; cursor: pointer;
  padding: 0.25rem; border-radius: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}
.modal-close:hover { background: #f3f4f6; color: #1c0845; }

.modal-body {
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-check { flex-direction: row; align-items: center; gap: 0.5rem; }

.form-label {
  font-size: 0.75rem; font-weight: 700; color: #5f527a;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.form-label-inline { font-size: 0.875rem; color: #1c0845; font-weight: 500; text-transform: none; letter-spacing: 0; }

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e4e0eb; border-radius: 0.75rem;
  font-size: 0.875rem; color: #1c0845;
  outline: none; background: #f8f7fa;
  transition: all 0.2s ease;
  width: 100%; box-sizing: border-box;
}
.form-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
  background: white;
}

.checkbox { width: 1rem; height: 1rem; accent-color: #2f0d73; cursor: pointer; }
.delete-text { font-size: 0.9rem; color: #5f527a; line-height: 1.6; }
</style>
