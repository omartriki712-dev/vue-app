<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Gestion des étudiants</h2>
      
      <div class="button-group">
        <button class="btn-secondary">
          <Upload class="h-4 w-4" />
          Importer CSV/Excel
        </button>
        <button class="btn-primary">
          <Plus class="h-5 w-5" />
          Ajouter un étudiant
        </button>
      </div>
    </div>

    <div 
      @dragover.prevent="isDragging = true" 
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      class="drop-zone"
      :class="isDragging ? 'drop-zone--active' : ''"
    >
      <div class="drop-icon" :class="isDragging ? 'drop-icon--active' : ''">
        <FileSpreadsheet class="h-10 w-10" />
      </div>

      <h3 class="drop-title">
        Glissez-déposez votre fichier ici
      </h3>
      <p class="drop-subtitle">
        Formats acceptés : CSV, Excel (.xlsx, .xls)
      </p>

      <button 
        @click="$refs.fileInput.click()"
        class="btn-secondary"
      >
        Parcourir les fichiers
      </button>

      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept=".csv, .xlsx, .xls"
        @change="handleFileSelect"
      />
    </div>

    <div class="info-box">
      <div class="info-icon">
        <Info class="h-5 w-5 text-[#2f0d73]" />
      </div>
      <p class="info-text">
        <span class="info-label">Format attendu :</span> 
        Nom, Prénom, Email, Promotion (FIE1-5 ou FIA), Parcours (optionnel)
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Upload, Plus, FileSpreadsheet, Info } from 'lucide-vue-next';

const isDragging = ref(false);
const fileInput = ref(null);

const handleDrop = (e) => {
  isDragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    console.log("Fichier déposé :", files[0].name);
    // Logique de traitement ici
  }
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log("Fichier sélectionné :", file.name);
    // Logique de traitement ici
  }
};
</script>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Conteneur principal */
.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

/* En-tête */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    align-items: center;
  }
}

.page-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1c0845;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Boutons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  background-color: #2f0d73;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1c0845;
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #2f0d73;
  color: #2f0d73;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

.btn-secondary:active {
  transform: scale(0.95);
}

/* Zone de dépôt */
.drop-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e4e0eb;
  border-radius: 2rem;
  padding: 4rem;
  background-color: white;
  transition: all 0.3s ease;
}

.drop-zone:hover {
  border-color: rgba(124, 58, 237, 0.4);
}

.drop-zone--active {
  border-color: #7c3aed;
  background-color: #f3e8ff;
}

.drop-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background-color: #f8f7fa;
  color: #5f527a;
  transition: all 0.3s ease;
}

.drop-zone:hover .drop-icon {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.drop-icon--active {
  background-color: #7c3aed;
  color: white;
}

.drop-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1c0845;
  margin-bottom: 0.5rem;
  text-align: center;
}

.drop-subtitle {
  font-size: 0.875rem;
  color: #5f527a;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
}

/* Boîte d'information */
.info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f8f7fa;
  border: 1px solid rgba(228, 224, 235, 0.4);
  border-radius: 1rem;
  padding: 1.25rem;
}

.info-icon {
  padding: 0.5rem;
  background-color: white;
  border: 1px solid rgba(228, 224, 235, 0.4);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.875rem;
  color: #5f527a;
  font-weight: 500;
  line-height: 1.5;
}

.info-label {
  font-weight: bold;
  color: #1c0845;
}
</style>