<template>
  <div class="page-container">

    <!-- ── Header ─────────────────────────────────────── -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Planification des évaluations</h2>
        <p class="page-subtitle">Associez un questionnaire et une période à chaque cours</p>
      </div>
      <div class="header-right">
        <div class="view-toggle">
          <button :class="['toggle-btn', viewMode === 'list' ? 'toggle-btn--active' : '']" @click="viewMode = 'list'">
            <LayoutList class="h-4 w-4" /> Liste
          </button>
          <button :class="['toggle-btn', viewMode === 'calendar' ? 'toggle-btn--active' : '']" @click="viewMode = 'calendar'">
            <CalendarDays class="h-4 w-4" /> Calendrier
          </button>
        </div>
      </div>
    </div>

    <!-- ── Stats strip ─────────────────────────────────── -->
    <div class="stats-strip">
      <div class="stat-card">
        <div class="stat-icon stat-green"><CheckCircle2 class="h-5 w-5" /></div>
        <div>
          <p class="stat-val">{{ counts.planifie }}</p>
          <p class="stat-lbl">Planifié(s)</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-blue"><PlayCircle class="h-5 w-5" /></div>
        <div>
          <p class="stat-val">{{ counts.enCours }}</p>
          <p class="stat-lbl">En cours</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-gray"><Clock class="h-5 w-5" /></div>
        <div>
          <p class="stat-val">{{ counts.nonPlanifie }}</p>
          <p class="stat-lbl">À planifier</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-red"><XCircle class="h-5 w-5" /></div>
        <div>
          <p class="stat-val">{{ counts.termine }}</p>
          <p class="stat-lbl">Terminé(s)</p>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────── -->
    <div class="filters-bar">
      <div class="search-wrap">
        <Search class="search-icon" />
        <input v-model="searchQ" type="text" placeholder="Rechercher un cours, enseignant…" class="search-input" />
      </div>
      <div class="filter-chips">
        <button
          v-for="f in statusFilters"
          :key="f.key"
          class="chip"
          :class="activeFilter === f.key ? 'chip--active' : ''"
          @click="activeFilter = f.key"
        >{{ f.label }}</button>
      </div>
    </div>

    <!-- ══════════ LIST VIEW ══════════ -->
    <template v-if="viewMode === 'list'">
      <div class="courses-list">
        <div
          v-for="course in filteredCourses"
          :key="course.code"
          class="course-row"
          :class="'course-row--' + course.status"
        >
          <!-- Left icon -->
          <div class="course-icon" :class="'icon--' + course.status">
            <BookOpen class="h-5 w-5" />
          </div>

          <!-- Info -->
          <div class="course-info">
            <div class="course-name-row">
              <span class="course-code">{{ course.code }}</span>
              <span class="course-name">{{ course.name }}</span>
            </div>
            <div class="course-meta">
              <span class="meta-chip"><User class="h-3 w-3" />{{ course.teacher }}</span>
              <span v-if="course.session" class="meta-chip meta-chip--date">
                <CalendarDays class="h-3 w-3" />
                {{ fmtDate(course.session.openDate) }} → {{ fmtDate(course.session.closeDate) }}
              </span>
              <span v-if="course.session" class="meta-chip meta-chip--form">
                <ClipboardList class="h-3 w-3" />
                {{ course.session.formName }}
              </span>
              <span v-if="course.session" class="meta-chip">
                {{ course.session.promos.join(', ') }}
              </span>
            </div>
          </div>

          <!-- Status + action -->
          <div class="course-right">
            <span class="status-badge" :class="'badge--' + course.status">
              <component :is="statusIcon(course.status)" class="h-3 w-3" />
              {{ statusLabel(course.status) }}
            </span>
            <button class="btn-plan" @click="openModal(course)">
              <CalendarPlus class="h-4 w-4" />
              {{ course.session ? 'Modifier' : 'Planifier' }}
            </button>
            <button v-if="course.session" class="btn-cancel-plan" @click="cancelSession(course)" title="Annuler la planification">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div v-if="filteredCourses.length === 0" class="empty-state">
          <Search class="h-8 w-8" />
          <p>Aucun cours correspondant à votre recherche.</p>
        </div>
      </div>
    </template>

    <!-- ══════════ CALENDAR VIEW ══════════ -->
    <template v-if="viewMode === 'calendar'">
      <div class="calendar-wrapper">
        <div class="calendar-header-row">
          <button class="cal-nav" @click="prevMonth"><ChevronLeft class="h-4 w-4" /></button>
          <h3 class="cal-month">{{ calMonthLabel }}</h3>
          <button class="cal-nav" @click="nextMonth"><ChevronRight class="h-4 w-4" /></button>
        </div>

        <!-- Timeline bars -->
        <div class="timeline-list">
          <template v-for="course in plannedCourses" :key="course.code">
            <div class="timeline-row">
              <div class="timeline-label">
                <span class="tl-code">{{ course.code }}</span>
                <span class="tl-name">{{ course.name }}</span>
              </div>
              <div class="timeline-track">
                <div
                  class="timeline-bar"
                  :class="'bar--' + course.status"
                  :style="barStyle(course)"
                  :title="`${fmtDate(course.session.openDate)} → ${fmtDate(course.session.closeDate)}`"
                >
                  <span class="bar-label">{{ fmtDate(course.session.openDate) }} → {{ fmtDate(course.session.closeDate) }}</span>
                </div>
              </div>
              <span class="status-badge ml-2" :class="'badge--' + course.status">{{ statusLabel(course.status) }}</span>
            </div>
          </template>
          <div v-if="plannedCourses.length === 0" class="empty-state">
            <CalendarDays class="h-8 w-8" />
            <p>Aucune session planifiée ce mois-ci.</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════════ PLANIFIER MODAL ══════════ -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">

          <!-- Modal header -->
          <div class="modal-header">
            <div class="modal-title-row">
              <div class="modal-icon"><CalendarDays class="h-5 w-5" /></div>
              <div>
                <h3 class="modal-title">Planifier la session</h3>
                <p class="modal-sub">{{ activeCourse?.code }} — {{ activeCourse?.name }}</p>
              </div>
            </div>
            <button class="modal-close" @click="showModal = false"><X class="h-5 w-5" /></button>
          </div>

          <form class="modal-body" @submit.prevent="saveSession">

            <!-- Questionnaire selector -->
            <div class="form-section">
              <label class="form-label"><ClipboardList class="h-3.5 w-3.5" /> Questionnaire associé</label>
              <div class="form-cards">
                <label
                  v-for="f in forms"
                  :key="f.id"
                  class="form-card-select"
                  :class="modalForm.formId === f.id ? 'form-card-select--active' : ''"
                >
                  <input type="radio" :value="f.id" v-model="modalForm.formId" class="hidden" required />
                  <div class="fcs-top">
                    <div class="fcs-icon"><ClipboardList class="h-4 w-4" /></div>
                    <span class="fcs-promo-tag" :class="f.promoType === 'FIE' ? 'tag-fie' : 'tag-fia'">{{ f.promoType }}</span>
                    <span v-if="modalForm.formId === f.id" class="fcs-check">✓</span>
                  </div>
                  <p class="fcs-name">{{ f.name }}</p>
                  <p class="fcs-meta">{{ f.year }} · {{ f.questions }} questions</p>
                </label>
              </div>
            </div>

            <!-- Promotions -->
            <div class="form-section">
              <label class="form-label"><Users class="h-3.5 w-3.5" /> Promotions ciblées</label>
              <div class="promo-chips">
                <label
                  v-for="p in allPromos"
                  :key="p"
                  class="promo-chip"
                  :class="modalForm.promos.includes(p) ? 'promo-chip--active' : ''"
                >
                  <input type="checkbox" :value="p" v-model="modalForm.promos" class="hidden" />
                  {{ p }}
                </label>
              </div>
            </div>

            <!-- Dates -->
            <div class="form-section">
              <label class="form-label"><CalendarDays class="h-3.5 w-3.5" /> Période d'évaluation</label>
              <div class="date-row">
                <div class="date-field">
                  <label class="date-label">Date d'ouverture</label>
                  <div class="date-input-wrap" :class="modalForm.openDate ? 'date-input-wrap--filled' : ''">
                    <Calendar class="h-4 w-4 date-input-icon" />
                    <input type="date" v-model="modalForm.openDate" class="date-input" required />
                  </div>
                </div>
                <div class="date-field">
                  <label class="date-label">Date de clôture <span class="auto-tag">automatique</span></label>
                  <div class="date-input-wrap date-input-wrap--readonly" :class="computedClose ? 'date-input-wrap--filled' : ''">
                    <Calendar class="h-4 w-4 date-input-icon" />
                    <span class="date-readonly">{{ computedCloseLabel || '— après ouverture' }}</span>
                  </div>
                  <p v-if="computedCloseLabel" class="date-hint">7 jours après l'ouverture</p>
                </div>
              </div>
            </div>

            <!-- Notifications toggle -->
            <div class="form-section">
              <label class="form-label"><Bell class="h-3.5 w-3.5" /> Options</label>
              <div class="options-row">
                <label class="option-item">
                  <input type="checkbox" v-model="modalForm.notifyStudents" class="checkbox" />
                  <div>
                    <p class="option-title">Notifier les étudiants</p>
                    <p class="option-sub">Envoi d'un rappel à l'ouverture</p>
                  </div>
                </label>
                <label class="option-item">
                  <input type="checkbox" v-model="modalForm.anonymous" class="checkbox" />
                  <div>
                    <p class="option-title">Réponses anonymes</p>
                    <p class="option-sub">L'enseignant ne verra pas les noms</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Error -->
            <p v-if="modalError" class="modal-error">{{ modalError }}</p>

            <!-- Actions -->
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="showModal = false">Annuler</button>
              <button type="submit" class="btn-primary" :disabled="!canSave">
                <Save class="h-4 w-4" /> Enregistrer la session
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  BookOpen, User, Calendar, CalendarPlus, CalendarDays,
  CheckCircle2, Clock, XCircle, PlayCircle, X, Save,
  Search, LayoutList, Trash2, ClipboardList, Bell, Users,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next';

// ─── VIEW MODE ────────────────────────────────────────────────────
const viewMode = ref('list');

// ─── FORMS (from questionnaire module) ──────────────────────────
const forms = ref([
  { id: 1, name: 'Évaluation Standard ISIS', year: '2024 - 2025', promoType: 'FIE', questions: 6 },
  { id: 2, name: 'Évaluation FIA — Alternance', year: '2024 - 2025', promoType: 'FIA', questions: 3 },
]);

const allPromos = ['FIE 1', 'FIE 2', 'FIE 3', 'FIE 4', 'FIE 5', 'FIA 3', 'FIA 4', 'FIA 5'];

// ─── COURSES DATA ─────────────────────────────────────────────────
const courses = ref([
  { code: 'MAT501', name: 'Mathématiques Appliquées',       teacher: 'Dr. Martin',   status: 'planifie', session: { formId: 1, formName: 'Évaluation Standard ISIS', openDate: '2026-02-10', closeDate: '2026-02-17', promos: ['FIE 3', 'FIE 4'], notifyStudents: true,  anonymous: true } },
  { code: 'INF502', name: 'Base de Données',                teacher: 'Prof. Leroy',  status: 'planifie', session: { formId: 1, formName: 'Évaluation Standard ISIS', openDate: '2026-03-01', closeDate: '2026-03-08', promos: ['FIE 2'], notifyStudents: false, anonymous: true } },
  { code: 'MAN501', name: 'Gestion de Projet',              teacher: 'Prof. Moreau', status: 'en-cours', session: { formId: 2, formName: 'Évaluation FIA — Alternance', openDate: '2026-02-15', closeDate: '2026-02-22', promos: ['FIA 3', 'FIA 4'], notifyStudents: true,  anonymous: true } },
  { code: 'STA501', name: 'Statistiques Avancées',          teacher: 'Prof. Dupont', status: 'non-planifie', session: null },
  { code: 'LAN501', name: 'Anglais Technique',              teacher: 'Mrs. Smith',   status: 'non-planifie', session: null },
  { code: 'INF501', name: 'Programmation Orientée Objet',   teacher: 'Dr. Bernard',  status: 'termine', session: { formId: 1, formName: 'Évaluation Standard ISIS', openDate: '2026-01-15', closeDate: '2026-01-22', promos: ['FIE 1'], notifyStudents: false, anonymous: true } },
  { code: 'PHY501', name: 'Physique Appliquée',             teacher: 'Prof. Morin',  status: 'non-planifie', session: null },
  { code: 'RES501', name: 'Réseaux et Protocoles',          teacher: 'Dr. Chevalier',status: 'planifie', session: { formId: 1, formName: 'Évaluation Standard ISIS', openDate: '2026-03-10', closeDate: '2026-03-17', promos: ['FIE 3'], notifyStudents: true,  anonymous: false } },
]);

// ─── COUNTS ───────────────────────────────────────────────────────
const counts = computed(() => ({
  planifie:    courses.value.filter(c => c.status === 'planifie').length,
  enCours:     courses.value.filter(c => c.status === 'en-cours').length,
  nonPlanifie: courses.value.filter(c => c.status === 'non-planifie').length,
  termine:     courses.value.filter(c => c.status === 'termine').length,
}));

// ─── FILTERS ──────────────────────────────────────────────────────
const searchQ = ref('');
const activeFilter = ref('all');
const statusFilters = [
  { key: 'all',          label: 'Tous' },
  { key: 'non-planifie', label: 'À planifier' },
  { key: 'planifie',     label: 'Planifié' },
  { key: 'en-cours',     label: 'En cours' },
  { key: 'termine',      label: 'Terminé' },
];

const filteredCourses = computed(() => {
  const q = searchQ.value.toLowerCase();
  return courses.value.filter(c => {
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q);
    const matchF = activeFilter.value === 'all' || c.status === activeFilter.value;
    return matchQ && matchF;
  });
});

const plannedCourses = computed(() => courses.value.filter(c => c.session));

// ─── STATUS HELPERS ───────────────────────────────────────────────
function statusLabel(s) {
  return { 'planifie': 'Planifié', 'en-cours': 'En cours', 'non-planifie': 'À planifier', 'termine': 'Terminé' }[s] || s;
}
function statusIcon(s) {
  return { 'planifie': CheckCircle2, 'en-cours': PlayCircle, 'non-planifie': Clock, 'termine': XCircle }[s] || Clock;
}

// ─── MODAL ────────────────────────────────────────────────────────
const showModal  = ref(false);
const activeCourse = ref(null);
const modalForm  = ref({ formId: null, promos: [], openDate: '', notifyStudents: true, anonymous: true });
const modalError = ref('');

function openModal(course) {
  activeCourse.value = course;
  modalForm.value = course.session
    ? { ...course.session, openDate: course.session.openDate }
    : { formId: null, promos: [], openDate: '', notifyStudents: true, anonymous: true };
  modalError.value = '';
  showModal.value = true;
}

// Auto-close date = open + 7 days
const computedClose = computed(() => {
  if (!modalForm.value.openDate) return '';
  const d = new Date(modalForm.value.openDate);
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
});
const computedCloseLabel = computed(() =>
  computedClose.value
    ? new Date(computedClose.value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''
);

const canSave = computed(() =>
  modalForm.value.formId && modalForm.value.openDate && modalForm.value.promos.length > 0
);

function saveSession() {
  if (!canSave.value) { modalError.value = 'Sélectionnez un questionnaire, une date et au moins une promotion.'; return; }
  const form = forms.value.find(f => f.id === modalForm.value.formId);
  const idx = courses.value.findIndex(c => c.code === activeCourse.value.code);
  if (idx !== -1) {
    courses.value[idx].session = {
      formId:   modalForm.value.formId,
      formName: form.name,
      openDate:  modalForm.value.openDate,
      closeDate: computedClose.value,
      promos:    [...modalForm.value.promos],
      notifyStudents: modalForm.value.notifyStudents,
      anonymous: modalForm.value.anonymous,
    };
    // Auto-update status based on dates
    const now = new Date().toISOString().split('T')[0];
    if (now >= modalForm.value.openDate && now <= computedClose.value) {
      courses.value[idx].status = 'en-cours';
    } else if (now > computedClose.value) {
      courses.value[idx].status = 'termine';
    } else {
      courses.value[idx].status = 'planifie';
    }
  }
  showModal.value = false;
}

function cancelSession(course) {
  const idx = courses.value.findIndex(c => c.code === course.code);
  if (idx !== -1) { courses.value[idx].session = null; courses.value[idx].status = 'non-planifie'; }
}

// ─── DATE HELPERS ─────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────
const calYear  = ref(new Date().getFullYear());
const calMonth = ref(new Date().getMonth());

const calMonthLabel = computed(() =>
  new Date(calYear.value, calMonth.value, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
);

function prevMonth() { if (calMonth.value === 0) { calMonth.value = 11; calYear.value--; } else calMonth.value--; }
function nextMonth() { if (calMonth.value === 11) { calMonth.value = 0;  calYear.value++; } else calMonth.value++; }

const daysInMonth = computed(() => new Date(calYear.value, calMonth.value + 1, 0).getDate());
const monthStart  = computed(() => new Date(calYear.value, calMonth.value, 1).getTime());
const monthEnd    = computed(() => new Date(calYear.value, calMonth.value + 1, 0).getTime());

function barStyle(course) {
  if (!course.session) return { display: 'none' };
  const open  = new Date(course.session.openDate).getTime();
  const close = new Date(course.session.closeDate).getTime();
  const total = monthEnd.value - monthStart.value;
  const left  = Math.max(0, (open  - monthStart.value) / total * 100);
  const right = Math.min(100, (close - monthStart.value) / total * 100);
  const width = Math.max(2, right - left);
  return { left: left + '%', width: width + '%' };
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.page-container { display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.4s ease-out; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.page-title  { font-size: 1.25rem; font-weight: 700; color: #1c0845; }
.page-subtitle { font-size: 0.8rem; color: #5f527a; margin-top: 0.25rem; }
.header-right { display: flex; align-items: center; gap: 0.75rem; }

/* View toggle */
.view-toggle { display: flex; border: 1px solid #e4e0eb; border-radius: 0.75rem; overflow: hidden; }
.toggle-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600;
  border: none; background: #f8f7fa; color: #5f527a; cursor: pointer; transition: all 0.15s ease;
}
.toggle-btn--active { background: #2f0d73; color: white; }

/* Stats strip */
.stats-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
.stat-card {
  display: flex; align-items: center; gap: 0.875rem;
  background: white; padding: 1rem 1.25rem;
  border-radius: 1rem; border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.stat-icon { width: 2.25rem; height: 2.25rem; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-green { background: #dcfce7; color: #15803d; }
.stat-blue  { background: #dbeafe; color: #1d4ed8; }
.stat-gray  { background: #f3f4f6; color: #6b7280; }
.stat-red   { background: #fee2e2; color: #dc2626; }
.stat-val   { font-size: 1.25rem; font-weight: 700; color: #1c0845; }
.stat-lbl   { font-size: 0.7rem; color: #5f527a; font-weight: 500; }

/* Filters */
.filters-bar {
  display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;
  background: white; padding: 0.875rem 1.25rem;
  border-radius: 1rem; border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af; }
.search-input {
  width: 100%; padding: 0.55rem 1rem 0.55rem 2.25rem;
  border: 1px solid #e4e0eb; border-radius: 0.75rem; font-size: 0.875rem;
  color: #1c0845; outline: none; background: #f8f7fa;
  transition: all 0.2s ease; box-sizing: border-box;
}
.search-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124,58,237,0.15); background: white; }
.filter-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip {
  padding: 0.3rem 0.875rem; border-radius: 99px; font-size: 0.78rem; font-weight: 600;
  border: 1.5px solid #e4e0eb; background: #f8f7fa; color: #5f527a;
  cursor: pointer; transition: all 0.15s ease;
}
.chip--active { background: #2f0d73; color: white; border-color: #2f0d73; }

/* Course list */
.courses-list { display: flex; flex-direction: column; gap: 0.625rem; }
.course-row {
  display: flex; align-items: center; gap: 1rem;
  background: white; border: 1px solid rgba(228,224,235,0.6);
  border-radius: 1rem; padding: 1rem 1.25rem;
  transition: all 0.15s ease; flex-wrap: wrap;
}
.course-row:hover { border-color: #c4b5fd; box-shadow: 0 2px 8px rgba(124,58,237,0.08); }
.course-row--en-cours { border-left: 3px solid #3b82f6; }
.course-row--planifie { border-left: 3px solid #22c55e; }
.course-row--termine  { border-left: 3px solid #9ca3af; }
.course-row--non-planifie { border-left: 3px solid #e4e0eb; }

.course-icon {
  width: 2.5rem; height: 2.5rem; border-radius: 0.75rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon--planifie    { background: #dcfce7; color: #15803d; }
.icon--en-cours    { background: #dbeafe; color: #1d4ed8; }
.icon--non-planifie{ background: #f3f4f6; color: #6b7280; }
.icon--termine     { background: #fee2e2; color: #dc2626; }

.course-info { flex: 1; min-width: 200px; }
.course-name-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.375rem; }
.course-code { font-size: 0.75rem; font-weight: 700; color: #2f0d73; background: #ede9fe; padding: 0.15rem 0.55rem; border-radius: 4px; }
.course-name { font-size: 0.9rem; font-weight: 600; color: #1c0845; }
.course-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.meta-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.72rem; color: #5f527a; font-weight: 500;
  background: #f8f7fa; padding: 0.175rem 0.55rem; border-radius: 4px;
}
.meta-chip--date { background: #faf5ff; color: #7c3aed; }
.meta-chip--form { background: #f0fdf4; color: #15803d; }

.course-right { display: flex; align-items: center; gap: 0.625rem; flex-shrink: 0; }

/* Status badges */
.status-badge {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 0.2rem 0.65rem; border-radius: 99px;
}
.badge--planifie    { background: #dcfce7; color: #15803d; }
.badge--en-cours    { background: #dbeafe; color: #1d4ed8; }
.badge--non-planifie{ background: #f3f4f6; color: #6b7280; }
.badge--termine     { background: #fee2e2; color: #dc2626; }
.ml-2 { margin-left: 0.5rem; }

.btn-plan {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1rem; background: #2f0d73; color: white;
  border: none; border-radius: 0.625rem; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
}
.btn-plan:hover { background: #1c0845; }

.btn-cancel-plan {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; background: #fee2e2; color: #dc2626;
  border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.15s ease;
}
.btn-cancel-plan:hover { background: #dc2626; color: white; }

/* Empty state */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem; padding: 3rem; color: #9ca3af;
  background: white; border-radius: 1rem; font-size: 0.875rem;
  border: 2px dashed rgba(228,224,235,0.8);
}

/* Calendar */
.calendar-wrapper {
  background: white; border-radius: 1.25rem;
  border: 1px solid rgba(228,224,235,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;
}
.calendar-header-row { display: flex; align-items: center; gap: 1rem; }
.cal-nav {
  width: 2rem; height: 2rem; background: #f8f7fa; border: 1px solid #e4e0eb;
  border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #5f527a; transition: all 0.15s ease;
}
.cal-nav:hover { background: #ede9fe; color: #2f0d73; }
.cal-month { font-size: 1rem; font-weight: 700; color: #1c0845; flex: 1; }

.timeline-list { display: flex; flex-direction: column; gap: 0.75rem; }
.timeline-row { display: flex; align-items: center; gap: 1rem; }
.timeline-label { width: 180px; flex-shrink: 0; }
.tl-code { font-size: 0.7rem; font-weight: 700; color: #2f0d73; display: block; }
.tl-name { font-size: 0.78rem; color: #5f527a; font-weight: 500; }
.timeline-track { flex: 1; height: 2rem; background: #f8f7fa; border-radius: 0.5rem; position: relative; overflow: visible; }
.timeline-bar {
  position: absolute; top: 0; height: 100%; border-radius: 0.5rem;
  display: flex; align-items: center; padding: 0 0.5rem;
  font-size: 0.65rem; font-weight: 600; white-space: nowrap;
  overflow: hidden; transition: all 0.3s ease;
}
.bar--planifie { background: rgba(34,197,94,0.2); color: #15803d; border: 1px solid rgba(34,197,94,0.35); }
.bar--en-cours { background: rgba(59,130,246,0.2); color: #1d4ed8; border: 1px solid rgba(59,130,246,0.35); }
.bar--termine  { background: rgba(156,163,175,0.2); color: #6b7280; border: 1px solid rgba(156,163,175,0.35); }
.bar-label { overflow: hidden; text-overflow: ellipsis; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(28,8,69,0.45); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal {
  background: white; border-radius: 1.5rem;
  width: 100%; max-width: 580px;
  box-shadow: 0 24px 64px rgba(47,13,115,0.22);
  animation: zoomIn 0.2s ease-out;
  display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 1.5rem 1.5rem 0; flex-shrink: 0;
}
.modal-title-row { display: flex; align-items: center; gap: 0.875rem; }
.modal-icon { width: 2.5rem; height: 2.5rem; background: #ede9fe; color: #2f0d73; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-title { font-size: 1.1rem; font-weight: 700; color: #1c0845; }
.modal-sub   { font-size: 0.8rem; color: #5f527a; margin-top: 0.15rem; font-weight: 500; }
.modal-close { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0.25rem; border-radius: 0.5rem; display: flex; transition: all 0.15s ease; }
.modal-close:hover { background: #f3f4f6; color: #1c0845; }

.modal-body {
  padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;
  overflow-y: auto;
}

/* Form sections */
.form-section { display: flex; flex-direction: column; gap: 0.625rem; }
.form-label {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.7rem; font-weight: 700; color: #5f527a;
  text-transform: uppercase; letter-spacing: 0.05em;
}

/* Questionnaire cards */
.form-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.form-card-select {
  position: relative; padding: 1rem; border-radius: 0.875rem;
  border: 1.5px solid #e4e0eb; background: #f8f7fa;
  cursor: pointer; transition: all 0.15s ease;
}
.form-card-select:hover { border-color: #c4b5fd; background: #faf8ff; }
.form-card-select--active { border-color: #2f0d73; background: #f5f3ff; }
.fcs-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.625rem; }
.fcs-icon { width: 2rem; height: 2rem; background: #ede9fe; color: #7c3aed; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
.fcs-promo-tag { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; }
.tag-fie { background: #ede9fe; color: #2f0d73; }
.tag-fia { background: #fff7ed; color: #c2410c; }
.fcs-check { margin-left: auto; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #2f0d73; color: white; font-size: 0.65rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
.fcs-name { font-size: 0.82rem; font-weight: 700; color: #1c0845; margin-bottom: 0.25rem; line-height: 1.3; }
.fcs-meta { font-size: 0.7rem; color: #5f527a; }
.hidden { display: none; }

/* Promos */
.promo-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.promo-chip {
  padding: 0.3rem 0.75rem; border-radius: 99px;
  font-size: 0.78rem; font-weight: 600; cursor: pointer;
  border: 1.5px solid #e4e0eb; color: #5f527a; background: #f8f7fa;
  transition: all 0.15s ease; user-select: none;
}
.promo-chip--active { border-color: #2f0d73; color: #2f0d73; background: #ede9fe; }

/* Dates */
.date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.date-field { display: flex; flex-direction: column; gap: 0.375rem; }
.date-label { font-size: 0.72rem; font-weight: 600; color: #5f527a; display: flex; align-items: center; gap: 0.35rem; }
.auto-tag { font-weight: 400; color: #9ca3af; font-size: 0.65rem; }
.date-input-wrap {
  display: flex; align-items: center; gap: 0.5rem;
  border: 1.5px solid #e0dcf5; border-radius: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #faf9fe; color: #9893b0; transition: all 0.15s ease;
}
.date-input-wrap:focus-within { border-color: #7c3aed; background: white; color: #2f0d73; }
.date-input-wrap--filled { border-color: #c4baf0; background: white; color: #2d2455; }
.date-input-wrap--readonly { background: #f5f3fd; border-color: #e8e5f5; cursor: default; }
.date-input-icon { flex-shrink: 0; }
.date-input {
  border: none; background: transparent; outline: none;
  font-size: 0.875rem; color: inherit; flex: 1; cursor: pointer; font-family: inherit;
}
.date-input::-webkit-calendar-picker-indicator { opacity: 0; position: absolute; width: 100%; cursor: pointer; }
.date-readonly { font-size: 0.875rem; color: inherit; }
.date-hint { font-size: 0.68rem; color: #9ca3af; }

/* Options */
.options-row { display: flex; flex-direction: column; gap: 0.625rem; }
.option-item { display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; }
.option-item .checkbox { width: 1rem; height: 1rem; accent-color: #2f0d73; margin-top: 0.1rem; cursor: pointer; flex-shrink: 0; }
.option-title { font-size: 0.875rem; font-weight: 600; color: #1c0845; }
.option-sub   { font-size: 0.75rem; color: #5f527a; }

/* Error */
.modal-error { font-size: 0.8rem; color: #dc2626; background: #fef2f2; border-radius: 0.625rem; padding: 0.6rem 0.875rem; }

/* Footer */
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.25rem; }
.btn-secondary {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.25rem; background: white; color: #2f0d73;
  border: 1.5px solid #2f0d73; border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.btn-secondary:hover { background: #f5f3ff; }
.btn-primary {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.25rem; background: #2f0d73; color: white;
  border: none; border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: all 0.15s ease; box-shadow: 0 4px 12px rgba(47,13,115,0.2);
}
.btn-primary:hover:not(:disabled) { background: #1c0845; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
