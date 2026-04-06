<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des enseignements</h2>
        <p class="page-subtitle">Configurez les matières, UE et associations enseignants.</p>
      </div>
      
      <button class="btn-new-subject">
        <Plus class="h-5 w-5" />
        Nouvelle matière
      </button>
    </div>

    <div class="ue-list">
      <div v-for="ue in teachingUnits" :key="ue.code" class="ue-card">
        
        <div class="ue-header">
          <div class="ue-header-content">
            <div class="ue-icon">
              <component :is="ue.icon" class="w-6 h-6" />
            </div>
            <div>
              <p class="ue-code">{{ ue.code }}</p>
              <h3 class="ue-title">{{ ue.title }}</h3>
            </div>
          </div>
          <button class="ue-settings-btn">
            <Settings2 class="h-5 w-5" />
          </button>
        </div>

        <div class="subjects-list">
          <div v-for="subject in ue.subjects" :key="subject.code" class="subject-item">
            <div class="subject-content">
              <div class="subject-icon">
                <BookOpen class="h-5 w-5" />
              </div>
              <div>
                <h4 class="subject-name">{{ subject.name }}</h4>
                <div class="subject-meta">
                  <span class="subject-code">{{ subject.code }}</span>
                  <span class="meta-separator">•</span>
                  <span class="subject-teacher">{{ subject.teacher }}</span>
                </div>
              </div>
            </div>

            <div class="subject-actions">
              <button class="btn-edit">
                <Edit3 class="h-4 w-4" />
              </button>
              <button class="btn-delete">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button class="btn-add-subject">
            <Plus class="h-4 w-4" /> Ajouter une matière à {{ ue.code }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, BookOpen, Settings2, Edit3, Trash2, Terminal, Brain, BarChart3, BookText } from 'lucide-vue-next';

// Données fictives basées sur ModulesPages.vue
const teachingUnits = [
  { 
    id: 1, 
    code: 'UE501', 
    title: 'Fondamentaux', 
    icon: BookText,
    subjects: [
      { code: 'MAT501', name: 'Mathématiques Appliquées', teacher: 'Dr. Martin' },
      { code: 'STA501', name: 'Statistiques Avancées', teacher: 'Mme. Dupont' }
    ]
  },
  { 
    id: 2, 
    code: 'UE502', 
    title: 'Informatique', 
    icon: Terminal,
    subjects: [
      { code: 'INF501', name: 'POO Java', teacher: 'Dr. Bernard' },
      { code: 'INF502', name: 'Base de Données', teacher: 'M. Leroy' }
    ]
  },
  {
    id: 3,
    code: 'UE503',
    title: 'Langues & Communication',
    icon: Brain,
    subjects: [
      { code: 'LAN501', name: 'Anglais Technique', teacher: 'Mrs. Smith' }
    ]
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

.btn-new-subject {
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

.btn-new-subject:hover {
  background-color: #1c0845;
}

.btn-new-subject:active {
  transform: scale(0.95);
}

/* Liste des UE */
.ue-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.ue-card {
  background-color: white;
  border-radius: 2rem;
  border: 1px solid rgba(228, 224, 235, 0.4);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  overflow: hidden;
}

/* En-tête de l'UE */
.ue-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(228, 224, 235, 0.4);
  background-color: #fcfbfc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ue-header-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.ue-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #d946ef);
}

.ue-code {
  font-size: 0.625rem;
  font-weight: 900;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.125rem;
}

.ue-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1c0845;
}

.ue-settings-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: #5f527a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ue-settings-btn:hover {
  background-color: #f3f4f6;
}

/* Liste des matières */
.subjects-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subject-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.subject-item:hover {
  background-color: #f8f7fa;
  border-color: rgba(228, 224, 235, 0.5);
}

.subject-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subject-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: white;
  border: 1px solid rgba(228, 224, 235, 0.5);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f0d73;
  flex-shrink: 0;
}

.subject-name {
  font-size: 0.875rem;
  font-weight: bold;
  color: #1c0845;
}

.subject-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.125rem;
}

.subject-code {
  font-size: 0.625rem;
  font-weight: 900;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-separator {
  color: #d1d5db;
}

.subject-teacher {
  font-size: 0.75rem;
  color: #5f527a;
  font-weight: 500;
}

.subject-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.subject-item:hover .subject-actions {
  opacity: 1;
}

.btn-edit {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: #5f527a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  color: #7c3aed;
  background-color: #f3e8ff;
}

.btn-delete {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: #5f527a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* Bouton ajouter matière */
.btn-add-subject {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 2px dashed rgba(228, 224, 235, 0.5);
  border-radius: 1rem;
  background-color: transparent;
  color: #5f527a;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-add-subject:hover {
  border-color: rgba(124, 58, 237, 0.4);
  color: #7c3aed;
  background-color: rgba(243, 232, 255, 0.3);
}
</style>