<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Périodes d'évaluation</h2>
      <span class="page-subtitle">0 session(s) active(s)</span>
    </div>

    <div class="courses-list">
      <div v-for="course in courses" :key="course.code" class="course-card">
        
        <div class="course-header">
          <div class="course-icon">
            <BookOpen class="h-6 w-6" />
          </div>
          
          <div>
            <div class="course-title-row">
              <h3 class="course-name">{{ course.code }} — {{ course.name }}</h3>
            </div>
            <div class="course-meta">
              <span class="meta-item">
                <User class="h-3 w-3" /> {{ course.teacher }}
              </span>
              <span v-if="course.dateRange" class="meta-item">
                <Calendar class="h-3 w-3" /> {{ course.dateRange }}
              </span>
            </div>
          </div>
        </div>

        <div class="course-actions">
          <div class="status-badge" :class="`status-${course.status.toLowerCase().replace(' ', '-')}`">
            <component :is="statusStyles[course.status].icon" class="h-3 w-3" />
            {{ course.status }}
          </div>

          <button 
            @click="openPlanningModal(course)"
            class="btn-secondary"
          >
            <CalendarPlus class="h-4 w-4" />
            Planifier
          </button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="isModalOpen = false" class="modal-close">
            <X class="h-5 w-5" />
          </button>

          <div class="modal-header">
            <div class="modal-icon">
              <CalendarDays class="h-5 w-5" />
            </div>
            <h3 class="modal-title">Planifier la session</h3>
          </div>
          
          <p class="modal-subtitle">
            {{ selectedCourse?.code }} — {{ selectedCourse?.name }}
          </p>

          <div class="modal-form">
            <div class="form-group">
              <label class="form-label">Statut actuel</label>
              <div class="status-display">
                <Clock class="h-3 w-3" /> Non planifié
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date d'ouverture</label>
                <div class="form-input-wrapper">
                  <Calendar class="form-input-icon" />
                  <input type="date" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Date de clôture</label>
                <div class="form-input-wrapper">
                  <Calendar class="form-input-icon" />
                  <input type="date" class="form-input" />
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button @click="isModalOpen = false" class="btn-cancel">
                Annuler
              </button>
              <button class="btn-primary">
                <Save class="h-4 w-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  BookOpen, User, Calendar, CalendarPlus, CheckCircle2, 
  Clock, XCircle, X, CalendarDays, Save 
} from 'lucide-vue-next';

// Statuts et styles correspondants
const statusStyles = {
  'Planifié': { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  'Non planifié': { bg: 'bg-gray-50 text-gray-500 border-gray-100', icon: Clock },
  'Terminé': { bg: 'bg-red-50 text-red-600 border-red-100', icon: XCircle }
};

// Données fictives basées sur la maquette
const courses = ref([
  { code: 'MAT501', name: 'Mathématiques Appliquées', teacher: 'Dr. Martin', status: 'Planifié', dateRange: '10 févr. → 28 févr. 2026' },
  { code: 'INF502', name: 'Base de Données', teacher: 'Prof. Leroy', status: 'Planifié', dateRange: '01 mars → 20 mars 2026' },
  { code: 'MAN501', name: 'Gestion de Projet', teacher: 'Prof. Moreau', status: 'Planifié', dateRange: '15 févr. → 15 mars 2026' },
  { code: 'STA501', name: 'Statistiques Avancées', teacher: 'Prof. Dupont', status: 'Non planifié', dateRange: null },
  { code: 'LAN501', name: 'Anglais Technique', teacher: 'Mrs. Smith', status: 'Non planifié', dateRange: null },
  { code: 'INF501', name: 'Programmation Orientée Objet', teacher: 'Dr. Bernard', status: 'Terminé', dateRange: '15 janv. → 01 févr. 2026' }
]);

const isModalOpen = ref(false);
const selectedCourse = ref(null);

const openPlanningModal = (course) => {
  selectedCourse.value = course;
  isModalOpen.ref = true;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Conteneur principal */
.page-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

/* En-tête */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1c0845;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #5f527a;
  font-weight: 500;
}

/* Liste des cours */
.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Carte de cours */
.course-card {
  background-color: white;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.course-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
}

.course-icon {
  width: 3rem;
  height: 3rem;
  background-color: #2f0d73;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(47, 13, 115, 0.1);
  flex-shrink: 0;
}

.course-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-name {
  font-size: 1rem;
  font-weight: bold;
  color: #1c0845;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.meta-item {
  font-size: 0.75rem;
  color: #5f527a;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.course-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Badge de statut */
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}

.status-planifié {
  background-color: #f0fdf4;
  color: #059669;
  border-color: #dcfce7;
}

.status-non-planifié {
  background-color: #f9fafb;
  color: #6b7280;
  border-color: #f3f4f6;
}

.status-terminé {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}

/* Boutons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: #2f0d73;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(47, 13, 115, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1c0845;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border: 2px solid #2f0d73;
  color: #2f0d73;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 0.75rem;
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #2f0d73;
  color: white;
}

.btn-secondary:active {
  transform: scale(0.95);
}

.btn-cancel {
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: #5f527a;
  background-color: white;
  border: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(28, 8, 69, 0.4);
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  width: 100%;
  max-width: 32rem;
  border-radius: 2rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  padding: 2rem;
  position: relative;
  animation: zoomIn 0.2s ease-out;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #5f527a;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background-color: #f3f4f6;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.modal-icon {
  padding: 0.5rem;
  background-color: #f3e8ff;
  border-radius: 0.5rem;
  color: #2f0d73;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1c0845;
}

.modal-subtitle {
  font-size: 0.875rem;
  font-weight: bold;
  color: #5f527a;
  margin-bottom: 1.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Formulaire */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 900;
  color: #5f527a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input-wrapper {
  position: relative;
}

.form-input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #5f527a;
}

.form-input {
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background-color: #f8f7fa;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.status-display {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background-color: #f3f4f6;
  color: #5f527a;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: bold;
  border: 1px solid #e5e7eb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
}
</style>