<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des questionnaires</h2>
        <p class="page-subtitle">Créez et personnalisez les questionnaires d'évaluation.</p>
      </div>
      
      <button class="btn-new-form">
        <Plus class="h-5 w-5" />
        Nouveau questionnaire
      </button>
    </div>

    <div class="forms-grid">
      <div v-for="form in forms" :key="form.id" class="form-card">
        
        <div>
          <div class="form-card-header">
            <div class="form-icon">
              <ClipboardList class="h-6 w-6" />
            </div>
            <div class="form-status">
              Actif
            </div>
          </div>
          
          <h3 class="form-title">{{ form.title }}</h3>
          <p class="form-description">
            {{ form.description }}
          </p>

          <div class="form-meta">
            <div class="meta-item">
              <ListChecks class="h-4 w-4" />
              {{ form.questionsCount }} questions
            </div>
            <div class="meta-item">
              <Calendar class="h-4 w-4" />
              Modifié le {{ form.updatedAt }}
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-edit">
            Modifier
          </button>
          <button class="btn-delete">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="info-box">
      <div class="info-icon">
        <Sparkles class="h-5 w-5" />
      </div>
      <div>
        <h5 class="info-title">Types de questions supportés</h5>
        <p class="info-description">
          Vous pouvez ajouter des échelles de Likert (Tout à fait d'accord...), des choix multiples, ou des zones de texte libre pour les retours qualitatifs.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, ClipboardList, Trash2, ListChecks, Calendar, Sparkles } from 'lucide-vue-next';

const forms = [
  { 
    id: 1, 
    title: 'Évaluation Standard ISIS', 
    description: 'Questionnaire générique utilisé pour la majorité des modules de cours (Clarté, supports, charge de travail).', 
    questionsCount: 5, 
    updatedAt: '12/02/2026' 
  },
  { 
    id: 2, 
    title: 'Évaluation Stage', 
    description: 'Formulaire spécifique pour les retours sur les périodes d\'immersion professionnelle.', 
    questionsCount: 12, 
    updatedAt: '05/01/2026' 
  }
];
</script>

<style scoped>
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

.page-subtitle {
  font-size: 0.875rem;
  color: #5f527a;
  font-weight: 500;
}

/* Bouton nouveau questionnaire */
.btn-new-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  background-color: #2f0d73;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(47, 13, 115, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-new-form:hover {
  background-color: #1c0845;
}

.btn-new-form:active {
  transform: scale(0.95);
}

/* Grille et cartes */
.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .forms-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.form-icon {
  width: 3rem;
  height: 3rem;
  background-color: #f3e8ff;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
}

.form-status {
  padding: 0.25rem 0.75rem;
  background-color: #f0fdf4;
  color: #059669;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid #dcfce7;
}

.form-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1c0845;
  margin-bottom: 0.5rem;
}

.form-description {
  font-size: 0.875rem;
  color: #5f527a;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.form-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #5f527a;
  font-weight: bold;
}

.meta-item svg {
  color: #7c3aed;
}

/* Actions du formulaire */
.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  color: #1c0845;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background-color: #f3f4f6;
}

.btn-delete {
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(228, 224, 235, 0.5);
  color: #5f527a;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* Boîte d'information */
.info-box {
  background-color: rgba(224, 231, 255, 0.3);
  border: 1px solid #c7d2fe;
  padding: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 2rem;
}

.info-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c7d2fe;
  flex-shrink: 0;
  color: #7c3aed;
}

.info-title {
  font-size: 0.875rem;
  font-weight: bold;
  color: #1c0845;
  margin-bottom: 0.25rem;
}

.info-description {
  font-size: 0.75rem;
  color: #5f527a;
  line-height: 1.5;
}
</style>