<template>
  <div class="page-container">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des enseignants</h2>
        <p class="page-subtitle">{{ filteredTeachers.length }} enseignant(s) trouvé(s)</p>
      </div>
      <div class="button-group">
        <button class="btn-primary" @click="openAddModal">
          <Plus class="h-4 w-4" />
          Ajouter un enseignant
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-wrapper">
        <Search class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, email, spécialité..."
          class="search-input"
        />
      </div>
      <select v-model="filterSpecialite" class="filter-select">
        <option value="">Toutes les spécialités</option>
        <option v-for="s in specialites" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="filterStatus" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="Actif">Actif</option>
        <option value="Inactif">Inactif</option>
      </select>
      <button class="btn-reset" @click="resetFilters">
        <RotateCcw class="h-4 w-4" />
        Réinitialiser
      </button>
    </div>

    <!-- Stats strip -->
    <div class="stats-strip">
      <div class="stat-item">
        <div class="stat-icon stat-icon-purple"><Users class="h-5 w-5" /></div>
        <div>
          <p class="stat-value">{{ teachers.length }}</p>
          <p class="stat-label">Total enseignants</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon stat-icon-green"><UserCheck class="h-5 w-5" /></div>
        <div>
          <p class="stat-value">{{ teachers.filter(t => t.statut === 'Actif').length }}</p>
          <p class="stat-label">Actifs</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon stat-icon-orange"><BookOpen class="h-5 w-5" /></div>
        <div>
          <p class="stat-value">{{ totalMatieres }}</p>
          <p class="stat-label">Matières assignées</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon stat-icon-blue"><GraduationCap class="h-5 w-5" /></div>
        <div>
          <p class="stat-value">{{ specialites.length }}</p>
          <p class="stat-label">Spécialités</p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="table">
        <thead class="table-head">
          <tr>
            <th class="th">Enseignant</th>
            <th class="th">Email</th>
            <th class="th">Spécialité</th>
            <th class="th">Matières</th>
            <th class="th">Statut</th>
            <th class="th th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="tr">
            <td class="td">
              <div class="teacher-info">
                <div class="avatar">{{ initials(teacher.nom, teacher.prenom) }}</div>
                <div>
                  <p class="teacher-name">{{ teacher.prenom }} {{ teacher.nom }}</p>
                  <p class="teacher-id">ID: {{ teacher.id }}</p>
                </div>
              </div>
            </td>
            <td class="td td-secondary">{{ teacher.email }}</td>
            <td class="td">
              <span class="spec-badge">{{ teacher.specialite }}</span>
            </td>
            <td class="td">
              <div class="matieres-list">
                <span v-for="m in teacher.matieres.slice(0, 2)" :key="m" class="matiere-chip">{{ m }}</span>
                <span v-if="teacher.matieres.length > 2" class="matiere-more">+{{ teacher.matieres.length - 2 }}</span>
              </div>
            </td>
            <td class="td">
              <span class="status-badge" :class="teacher.statut === 'Actif' ? 'status-active' : 'status-inactive'">
                {{ teacher.statut }}
              </span>
            </td>
            <td class="td td-actions">
              <button class="action-btn action-view" @click="openViewModal(teacher)" title="Voir le profil">
                <Eye class="h-4 w-4" />
              </button>
              <button class="action-btn action-edit" @click="openEditModal(teacher)" title="Modifier">
                <Pencil class="h-4 w-4" />
              </button>
              <button class="action-btn action-delete" @click="confirmDelete(teacher)" title="Supprimer">
                <Trash2 class="h-4 w-4" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredTeachers.length === 0">
            <td colspan="6" class="td-empty">Aucun enseignant trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingTeacher ? 'Modifier l\'enseignant' : 'Ajouter un enseignant' }}</h3>
          <button class="modal-close" @click="closeModal"><X class="h-5 w-5" /></button>
        </div>
        <form class="modal-body" @submit.prevent="saveTeacher">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input v-model="form.prenom" type="text" class="form-input" placeholder="Prénom" required />
            </div>
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input v-model="form.nom" type="text" class="form-input" placeholder="Nom" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="email@isis.fr" required />
          </div>

          <!-- Password (required when adding, optional when editing) -->
          <div v-if="!editingTeacher" class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="input-password-wrap">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input input-password"
                placeholder="Mot de passe initial"
                required
              />
              <button type="button" class="pw-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-else class="form-group">
            <label class="change-pw-toggle">
              <input type="checkbox" v-model="changePassword" class="checkbox" />
              Modifier le mot de passe
            </label>
            <div v-if="changePassword" class="input-password-wrap" style="margin-top:0.5rem">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input input-password"
                placeholder="Nouveau mot de passe"
                :required="changePassword"
              />
              <button type="button" class="pw-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Spécialité</label>
              <select v-model="form.specialite" class="form-input" required>
                <option value="" disabled>Choisir une spécialité</option>
                <option v-for="s in specialites" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Statut</label>
              <select v-model="form.statut" class="form-input">
                <option>Actif</option>
                <option>Inactif</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Matières (séparées par des virgules)</label>
            <input v-model="formMatieres" type="text" class="form-input" placeholder="POO Java, Algorithmique, ..." />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
            <button type="submit" class="btn-primary">
              {{ editingTeacher ? 'Enregistrer' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Profile Modal -->
    <div v-if="showViewModal && viewingTeacher" class="modal-overlay" @click.self="showViewModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Profil de l'enseignant</h3>
          <button class="modal-close" @click="showViewModal = false"><X class="h-5 w-5" /></button>
        </div>
        <div class="modal-body">
          <div class="profile-header">
            <div class="avatar avatar-lg">{{ initials(viewingTeacher.nom, viewingTeacher.prenom) }}</div>
            <div>
              <h4 class="profile-name">{{ viewingTeacher.prenom }} {{ viewingTeacher.nom }}</h4>
              <p class="profile-email">{{ viewingTeacher.email }}</p>
              <span class="status-badge mt-1" :class="viewingTeacher.statut === 'Actif' ? 'status-active' : 'status-inactive'">
                {{ viewingTeacher.statut }}
              </span>
            </div>
          </div>
          <div class="profile-section">
            <p class="profile-section-label">Spécialité</p>
            <span class="spec-badge">{{ viewingTeacher.specialite }}</span>
          </div>
          <div class="profile-section">
            <p class="profile-section-label">Matières enseignées</p>
            <div class="matieres-grid">
              <span v-for="m in viewingTeacher.matieres" :key="m" class="matiere-chip">{{ m }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showViewModal = false">Fermer</button>
          <button class="btn-primary" @click="openEditModal(viewingTeacher); showViewModal = false">Modifier</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3 class="modal-title">Confirmer la suppression</h3>
          <button class="modal-close" @click="showDeleteModal = false"><X class="h-5 w-5" /></button>
        </div>
        <div class="modal-body">
          <p class="delete-text">
            Voulez-vous vraiment supprimer <strong>{{ teacherToDelete?.prenom }} {{ teacherToDelete?.nom }}</strong> ?
            Cette action est irréversible.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDeleteModal = false">Annuler</button>
          <button class="btn-danger" @click="deleteTeacher">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Plus, Pencil, Trash2, RotateCcw, X, Eye, EyeOff, Users, UserCheck, BookOpen, GraduationCap } from 'lucide-vue-next';

const specialites = ['Informatique', 'Mathématiques', 'Langues', 'Management', 'Sciences', 'Réseaux', 'Électronique'];

const teachers = ref([
  { id: 'P001', nom: 'Fontaine', prenom: 'Jean', email: 'j.fontaine@isis.fr', specialite: 'Informatique', matieres: ['POO Java', 'Algorithmique'], statut: 'Actif' },
  { id: 'P002', nom: 'Leblanc', prenom: 'Claire', email: 'c.leblanc@isis.fr', specialite: 'Mathématiques', matieres: ['Analyse', 'Algèbre linéaire', 'Probabilités'], statut: 'Actif' },
  { id: 'P003', nom: 'Rousseau', prenom: 'Pierre', email: 'p.rousseau@isis.fr', specialite: 'Langues', matieres: ['Anglais', 'Communication'], statut: 'Actif' },
  { id: 'P004', nom: 'Garnier', prenom: 'Isabelle', email: 'i.garnier@isis.fr', specialite: 'Management', matieres: ['Gestion de projet', 'Marketing'], statut: 'Actif' },
  { id: 'P005', nom: 'Chevalier', prenom: 'Marc', email: 'm.chevalier@isis.fr', specialite: 'Réseaux', matieres: ['Réseaux IP', 'Sécurité informatique'], statut: 'Inactif' },
  { id: 'P006', nom: 'Morin', prenom: 'Émilie', email: 'e.morin@isis.fr', specialite: 'Sciences', matieres: ['Physique', 'Thermodynamique'], statut: 'Actif' },
  { id: 'P007', nom: 'Petit', prenom: 'David', email: 'd.petit@isis.fr', specialite: 'Informatique', matieres: ['Base de données', 'Web développement', 'DevOps'], statut: 'Actif' },
]);

const searchQuery = ref('');
const filterSpecialite = ref('');
const filterStatus = ref('');

const filteredTeachers = computed(() => {
  return teachers.value.filter(t => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q ||
      t.nom.toLowerCase().includes(q) ||
      t.prenom.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.specialite.toLowerCase().includes(q);
    const matchSpec = !filterSpecialite.value || t.specialite === filterSpecialite.value;
    const matchStatus = !filterStatus.value || t.statut === filterStatus.value;
    return matchSearch && matchSpec && matchStatus;
  });
});

const totalMatieres = computed(() => teachers.value.reduce((sum, t) => sum + t.matieres.length, 0));

function resetFilters() {
  searchQuery.value = '';
  filterSpecialite.value = '';
  filterStatus.value = '';
}

function initials(nom, prenom) {
  return (prenom?.[0] || '') + (nom?.[0] || '');
}

// Form modal
const showFormModal = ref(false);
const editingTeacher = ref(null);
const form = ref({ prenom: '', nom: '', email: '', specialite: '', statut: 'Actif', matieres: [], password: '' });
const formMatieres = ref('');
const showPassword = ref(false);
const changePassword = ref(false);

function openAddModal() {
  editingTeacher.value = null;
  form.value = { prenom: '', nom: '', email: '', specialite: '', statut: 'Actif', matieres: [], password: '' };
  formMatieres.value = '';
  showPassword.value = false;
  changePassword.value = false;
  showFormModal.value = true;
}

function openEditModal(teacher) {
  editingTeacher.value = teacher;
  form.value = { ...teacher, matieres: [...teacher.matieres], password: '' };
  formMatieres.value = teacher.matieres.join(', ');
  showPassword.value = false;
  changePassword.value = false;
  showFormModal.value = true;
}

function closeModal() {
  showFormModal.value = false;
  editingTeacher.value = null;
}

function saveTeacher() {
  const matieres = formMatieres.value.split(',').map(m => m.trim()).filter(Boolean);
  const data = { ...form.value, matieres };
  if (editingTeacher.value) {
    const idx = teachers.value.findIndex(t => t.id === editingTeacher.value.id);
    if (idx !== -1) teachers.value[idx] = { ...data, id: editingTeacher.value.id };
  } else {
    const newId = 'P' + String(teachers.value.length + 1).padStart(3, '0');
    teachers.value.push({ ...data, id: newId });
  }
  closeModal();
}

// View modal
const showViewModal = ref(false);
const viewingTeacher = ref(null);

function openViewModal(teacher) {
  viewingTeacher.value = teacher;
  showViewModal.value = true;
}

// Delete modal
const showDeleteModal = ref(false);
const teacherToDelete = ref(null);

function confirmDelete(teacher) {
  teacherToDelete.value = teacher;
  showDeleteModal.value = true;
}

function deleteTeacher() {
  teachers.value = teachers.value.filter(t => t.id !== teacherToDelete.value.id);
  showDeleteModal.value = false;
  teacherToDelete.value = null;
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.4s ease-out;
}

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

.button-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: #2f0d73;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(47, 13, 115, 0.2);
}
.btn-primary:hover { background-color: #1c0845; }
.btn-primary:active { transform: scale(0.97); }

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: white;
  color: #2f0d73;
  border: 1px solid #2f0d73;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover { background-color: #f5f3ff; }

.btn-danger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger:hover { background-color: #dc2626; }

.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background-color: white;
  color: #5f527a;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-reset:hover { background-color: #f8f7fa; }

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.25rem;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1c0845;
  outline: none;
  background-color: #f8f7fa;
  transition: all 0.2s ease;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
  background-color: white;
}

.filter-select {
  padding: 0.6rem 1rem;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1c0845;
  background-color: #f8f7fa;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-select:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

/* Stats strip */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon-purple { background-color: #ede9fe; color: #2f0d73; }
.stat-icon-green { background-color: #dcfce7; color: #16a34a; }
.stat-icon-orange { background-color: #ffedd5; color: #ea580c; }
.stat-icon-blue { background-color: #dbeafe; color: #2563eb; }

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c0845;
}

.stat-label {
  font-size: 0.7rem;
  color: #5f527a;
  font-weight: 500;
}

/* Table */
.table-card {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-head {
  background-color: #f8f7fa;
  border-bottom: 1px solid rgba(228, 224, 235, 0.7);
}

.th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: #5f527a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.th-actions { text-align: center; }

.tr {
  border-bottom: 1px solid rgba(228, 224, 235, 0.4);
  transition: background-color 0.15s ease;
}
.tr:last-child { border-bottom: none; }
.tr:hover { background-color: #f8f7fa; }

.td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  vertical-align: middle;
}

.td-secondary {
  color: #5f527a;
  font-size: 0.8rem;
}

.td-actions { text-align: center; }

.td-empty {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
}

.avatar-lg {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.1rem;
}

.teacher-name {
  font-weight: 600;
  color: #1c0845;
  font-size: 0.875rem;
}

.teacher-id {
  font-size: 0.7rem;
  color: #9ca3af;
}

.spec-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #ffedd5;
  color: #ea580c;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.matieres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.matieres-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.matiere-chip {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 500;
}

.matiere-more {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background-color: #e2e8f0;
  color: #64748b;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active { background-color: #dcfce7; color: #16a34a; }
.status-inactive { background-color: #fee2e2; color: #dc2626; }

.mt-1 { margin-top: 0.25rem; }

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  margin: 0 0.15rem;
}

.action-view {
  background-color: #dbeafe;
  color: #2563eb;
}
.action-view:hover { background-color: #2563eb; color: white; }

.action-edit {
  background-color: #ede9fe;
  color: #2f0d73;
}
.action-edit:hover { background-color: #2f0d73; color: white; }

.action-delete {
  background-color: #fee2e2;
  color: #dc2626;
}
.action-delete:hover { background-color: #dc2626; color: white; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(28, 8, 69, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(47, 13, 115, 0.2);
  animation: fadeIn 0.2s ease-out;
}

.modal-sm { max-width: 400px; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1c0845;
}

.modal-close {
  background: none;
  border: none;
  color: #5f527a;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.modal-close:hover { background-color: #f3f4f6; color: #1c0845; }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #5f527a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e4e0eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1c0845;
  outline: none;
  background-color: #f8f7fa;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
  background-color: white;
}

.input-password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-password {
  padding-right: 2.75rem;
}

.pw-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s ease;
}
.pw-toggle:hover { color: #2f0d73; }

.change-pw-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #5f527a;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #2f0d73;
  cursor: pointer;
}

.delete-text {
  font-size: 0.9rem;
  color: #5f527a;
  line-height: 1.6;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(228, 224, 235, 0.5);
}

.profile-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1c0845;
}

.profile-email {
  font-size: 0.8rem;
  color: #5f527a;
  margin-top: 0.125rem;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #5f527a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
