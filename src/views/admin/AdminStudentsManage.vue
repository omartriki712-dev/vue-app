<template>
  <div class="page-container">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des étudiants</h2>
        <p class="page-subtitle">{{ filteredStudents.length }} étudiant(s) trouvé(s)</p>
      </div>
      <div class="button-group">
        <button class="btn-secondary" @click="showImportModal = true">
          <Upload class="h-4 w-4" />
          Importer CSV
        </button>
        <button class="btn-primary" @click="openAddModal">
          <Plus class="h-4 w-4" />
          Ajouter un étudiant
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
          placeholder="Rechercher par nom, email..."
          class="search-input"
        />
      </div>
      <select v-model="filterPromo" class="filter-select">
        <option value="">Toutes les promotions</option>
        <option v-for="p in promos" :key="p" :value="p">{{ p }}</option>
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

    <!-- Table -->
    <div class="table-card">
      <table class="table">
        <thead class="table-head">
          <tr>
            <th class="th">Étudiant</th>
            <th class="th">Email</th>
            <th class="th">Promotion</th>
            <th class="th">Statut</th>
            <th class="th th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            class="tr"
          >
            <td class="td">
              <div class="student-info">
                <div class="avatar">{{ initials(student.nom, student.prenom) }}</div>
                <div>
                  <p class="student-name">{{ student.prenom }} {{ student.nom }}</p>
                  <p class="student-id">ID: {{ student.id }}</p>
                </div>
              </div>
            </td>
            <td class="td td-secondary">{{ student.email }}</td>
            <td class="td">
              <span class="promo-badge">{{ student.promotion }}</span>
            </td>
            <td class="td">
              <span class="status-badge" :class="student.statut === 'Actif' ? 'status-active' : 'status-inactive'">
                {{ student.statut }}
              </span>
            </td>
            <td class="td td-actions">
              <button class="action-btn action-edit" @click="openEditModal(student)" title="Modifier">
                <Pencil class="h-4 w-4" />
              </button>
              <button class="action-btn action-delete" @click="confirmDelete(student)" title="Supprimer">
                <Trash2 class="h-4 w-4" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="5" class="td-empty">Aucun étudiant trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingStudent ? 'Modifier l\'étudiant' : 'Ajouter un étudiant' }}</h3>
          <button class="modal-close" @click="closeModal"><X class="h-5 w-5" /></button>
        </div>
        <form class="modal-body" @submit.prevent="saveStudent">
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
            <input v-model="form.email" type="email" class="form-input" placeholder="email@etudiant.fr" required />
          </div>

          <!-- Password (required when adding, optional when editing) -->
          <div v-if="!editingStudent" class="form-group">
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
              <label class="form-label">Promotion</label>
              <select v-model="form.promotion" class="form-input" required>
                <option value="" disabled>Choisir une promo</option>
                <option v-for="p in promos" :key="p" :value="p">{{ p }}</option>
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
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
            <button type="submit" class="btn-primary">
              {{ editingStudent ? 'Enregistrer' : 'Ajouter' }}
            </button>
          </div>
        </form>
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
            Voulez-vous vraiment supprimer <strong>{{ studentToDelete?.prenom }} {{ studentToDelete?.nom }}</strong> ?
            Cette action est irréversible.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDeleteModal = false">Annuler</button>
          <button class="btn-danger" @click="deleteStudent">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="showImportModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Importer des étudiants</h3>
          <button class="modal-close" @click="showImportModal = false"><X class="h-5 w-5" /></button>
        </div>
        <div class="modal-body">
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            class="drop-zone"
            :class="isDragging ? 'drop-zone--active' : ''"
          >
            <div class="drop-icon" :class="isDragging ? 'drop-icon--active' : ''">
              <FileSpreadsheet class="h-8 w-8" />
            </div>
            <p class="drop-title">Glissez-déposez votre fichier ici</p>
            <p class="drop-subtitle">Formats acceptés : CSV, Excel (.xlsx, .xls)</p>
            <button type="button" class="btn-secondary" @click="$refs.fileInput.click()">Parcourir</button>
            <input type="file" ref="fileInput" class="hidden" accept=".csv,.xlsx,.xls" @change="handleFileSelect" />
          </div>
          <div class="info-box">
            <Info class="h-4 w-4 text-[#2f0d73]" />
            <p class="info-text"><strong>Format attendu :</strong> Nom, Prénom, Email, Promotion, Statut</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showImportModal = false">Fermer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Upload, Plus, Pencil, Trash2, RotateCcw, X, FileSpreadsheet, Info, Eye, EyeOff } from 'lucide-vue-next';

const promos = ['FIE 1', 'FIE 2', 'FIE 3', 'FIE 4', 'FIE 5', 'FiA 3', 'FiA 4', 'FiA 5'];

const students = ref([
  { id: 'E001', nom: 'Dupont', prenom: 'Marie', email: 'marie.dupont@etud.isis.fr', promotion: 'FIE 1', statut: 'Actif' },
  { id: 'E002', nom: 'Martin', prenom: 'Lucas', email: 'lucas.martin@etud.isis.fr', promotion: 'FIE 2', statut: 'Actif' },
  { id: 'E003', nom: 'Bernard', prenom: 'Sophie', email: 'sophie.bernard@etud.isis.fr', promotion: 'FIE 3', statut: 'Actif' },
  { id: 'E004', nom: 'Leroy', prenom: 'Thomas', email: 'thomas.leroy@etud.isis.fr', promotion: 'FIE 4', statut: 'Inactif' },
  { id: 'E005', nom: 'Moreau', prenom: 'Camille', email: 'camille.moreau@etud.isis.fr', promotion: 'FIE 5', statut: 'Actif' },
  { id: 'E006', nom: 'Simon', prenom: 'Alexis', email: 'alexis.simon@etud.isis.fr', promotion: 'FiA 3', statut: 'Actif' },
  { id: 'E007', nom: 'Michel', prenom: 'Léa', email: 'lea.michel@etud.isis.fr', promotion: 'FiA 4', statut: 'Actif' },
  { id: 'E008', nom: 'Laurent', prenom: 'Hugo', email: 'hugo.laurent@etud.isis.fr', promotion: 'FiA 5', statut: 'Inactif' },
]);

const searchQuery = ref('');
const filterPromo = ref('');
const filterStatus = ref('');

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q || s.nom.toLowerCase().includes(q) || s.prenom.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchPromo = !filterPromo.value || s.promotion === filterPromo.value;
    const matchStatus = !filterStatus.value || s.statut === filterStatus.value;
    return matchSearch && matchPromo && matchStatus;
  });
});

function resetFilters() {
  searchQuery.value = '';
  filterPromo.value = '';
  filterStatus.value = '';
}

function initials(nom, prenom) {
  return (prenom?.[0] || '') + (nom?.[0] || '');
}

// Form modal
const showFormModal = ref(false);
const editingStudent = ref(null);
const form = ref({ prenom: '', nom: '', email: '', promotion: '', statut: 'Actif', password: '' });
const showPassword = ref(false);
const changePassword = ref(false);

function openAddModal() {
  editingStudent.value = null;
  form.value = { prenom: '', nom: '', email: '', promotion: '', statut: 'Actif', password: '' };
  showPassword.value = false;
  changePassword.value = false;
  showFormModal.value = true;
}

function openEditModal(student) {
  editingStudent.value = student;
  form.value = { ...student, password: '' };
  showPassword.value = false;
  changePassword.value = false;
  showFormModal.value = true;
}

function closeModal() {
  showFormModal.value = false;
  editingStudent.value = null;
}

function saveStudent() {
  if (editingStudent.value) {
    const idx = students.value.findIndex(s => s.id === editingStudent.value.id);
    if (idx !== -1) students.value[idx] = { ...form.value, id: editingStudent.value.id };
  } else {
    const newId = 'E' + String(students.value.length + 1).padStart(3, '0');
    students.value.push({ ...form.value, id: newId });
  }
  closeModal();
}

// Delete modal
const showDeleteModal = ref(false);
const studentToDelete = ref(null);

function confirmDelete(student) {
  studentToDelete.value = student;
  showDeleteModal.value = true;
}

function deleteStudent() {
  students.value = students.value.filter(s => s.id !== studentToDelete.value.id);
  showDeleteModal.value = false;
  studentToDelete.value = null;
}

// Import modal
const showImportModal = ref(false);
const isDragging = ref(false);

function handleDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) console.log('Fichier déposé :', file.name);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) console.log('Fichier sélectionné :', file.name);
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
  flex-wrap: wrap;
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
.btn-secondary:active { transform: scale(0.97); }

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
  transition: all 0.2s ease;
  background-color: #f8f7fa;
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

.td-actions {
  text-align: center;
}

.td-empty {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #2f0d73);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
}

.student-name {
  font-weight: 600;
  color: #1c0845;
  font-size: 0.875rem;
}

.student-id {
  font-size: 0.7rem;
  color: #9ca3af;
}

.promo-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #ede9fe;
  color: #2f0d73;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

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
  margin: 0 0.2rem;
}

.action-edit {
  background-color: #ede9fe;
  color: #2f0d73;
}
.action-edit:hover {
  background-color: #2f0d73;
  color: white;
}

.action-delete {
  background-color: #fee2e2;
  color: #dc2626;
}
.action-delete:hover {
  background-color: #dc2626;
  color: white;
}

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

.modal-sm {
  max-width: 400px;
}

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

/* Drop zone */
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 2px dashed #e4e0eb;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.2s ease;
}
.drop-zone:hover { border-color: rgba(124, 58, 237, 0.4); }
.drop-zone--active { border-color: #7c3aed; background-color: #f5f3ff; }

.drop-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f7fa;
  color: #5f527a;
  transition: all 0.2s ease;
}
.drop-icon--active { background-color: #7c3aed; color: white; }

.drop-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1c0845;
}

.drop-subtitle {
  font-size: 0.8rem;
  color: #5f527a;
}

.hidden { display: none; }

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background-color: #f5f3ff;
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 0.75rem;
  padding: 0.875rem;
}

.info-text {
  font-size: 0.8rem;
  color: #5f527a;
  line-height: 1.5;
}
</style>
