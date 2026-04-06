<template>
  <div class="relative min-h-screen bg-[#fcfcfc] font-jakarta">
    <TheSidebar activePage="Accueil" />

    <main class="ml-64 p-12">
      <div class="mb-8 ml-4 flex items-center gap-2 text-[13px] text-[#5f527a]">
        <Home class="w-4 h-4 cursor-pointer hover:text-[#7c3aed]" @click="$router.push('/student')" />
        <ChevronRight class="w-3 h-3 opacity-40" />
        <span class="cursor-pointer hover:text-[#7c3aed]" @click="$router.push('/student')">Accueil</span>
        <ChevronRight class="w-3 h-3 opacity-40" />
        <span class="cursor-pointer hover:text-[#7c3aed]" @click="$router.push('/semestre/5')">Semestre 5</span>
        <ChevronRight class="w-3 h-3 opacity-40" />
        <span class="font-bold text-[#7c3aed]">{{ moduleData.title }}</span>
      </div>

      <div class="mb-10 ml-4">
        <h1 class="text-[32px] font-bold text-[#1c0845]">{{ moduleData.title }}</h1>
        <p class="text-[#5f527a] font-medium">Évaluation des enseignements • {{ moduleData.code }}</p>
      </div>

      <div class="bg-white p-8 rounded-[32px] border border-[#e4e0eb66] shadow-sm mb-10 max-w-4xl ml-4">
        <div class="flex justify-between items-end mb-4">
          <div>
            <h3 class="text-lg font-bold text-[#1c0845]">Progression - {{ moduleData.title }}</h3>
            <p class="text-[#5f527a] text-sm">{{ completedCount }} sur {{ moduleData.subjects.length }} évaluations complétées</p>
          </div>
          <span class="text-4xl font-black text-[#7c3aed]">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-[#f2f1f4] h-4 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] h-full rounded-full transition-all duration-1000"
               :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <div class="module-list space-y-4 max-w-4xl ml-4">
        <article v-for="sub in moduleData.subjects" :key="sub.id" class="ue-card">
          <div class="left-icon">
            <BookOpen class="h-5 w-5" />
          </div>

          <div class="content">
            <div class="meta">
              <span class="code-badge">{{ sub.code }}</span>
            </div>

            <div class="top-row">
              <div class="title-block">
                <h4 class="ue-title">{{ sub.name }}</h4>
                <p class="subtitle">{{ sub.teacher }} • Date limite : {{ sub.deadline }}</p>
              </div>

              <div class="right-col">
                <div
                  v-if="!sub.completed"
                  :class="[
                    'deadline-pill',
                    getDaysRemaining(sub.deadline) <= 3 ? 'deadline-pill--danger' : 'deadline-pill--ok',
                  ]"
                >
                  <AlertCircle class="h-3 w-3" />
                  <span>Il vous reste {{ getDaysRemaining(sub.deadline) }} jours</span>
                </div>

                <button
                  v-if="!sub.completed"
                  @click="$router.push(`/evaluate/${sub.id}`)"
                  class="action-btn"
                >
                  Évaluer →
                </button>

                <div v-else class="complete-pill">
                  <CheckCircle2 class="h-4 w-4" />
                  Complétée
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div class="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-4 mt-8">
          <CheckCircle2 class="w-6 h-6 text-[#7c3aed] mt-1" />
          <div>
            <h5 class="text-sm font-bold text-[#1c0845]">Vos réponses sont anonymes</h5>
            <p class="text-xs text-[#5f527a]">Toutes vos évaluations sont enregistrées de manière totalement anonyme. Aucune donnée personnelle n'est associée à vos réponses. Participez en toute confiance !</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Home, ChevronRight, BookOpen, CheckCircle2, AlertCircle } from "lucide-vue-next";
import TheSidebar from '../../components/student/TheSidebar.vue';

const route = useRoute();
const moduleId = parseInt(route.params.id);

// Function to calculate days remaining
const getDaysRemaining = (dateStr) => {
  const deadline = new Date(dateStr);
  const today = new Date();
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const modulesDatabase = {
  1: { code: 'UE501', title: 'Fondamentaux', subjects: [
    { id: 1, code: 'MAT501', name: "Mathématiques Appliquées", teacher: "Dr. Martin", deadline: "2026-03-18", completed: false },
    { id: 2, code: 'AL501', name: "Algèbre Linéaire", teacher: "Mme. Lebron", deadline: "2026-03-20", completed: false },
    { id: 3, code: 'STA501', name: "Statistiques Avancées", teacher: "Mme. Dupont", deadline: "2026-03-10", completed: true }
  ]},
};

const moduleData = computed(() => modulesDatabase[moduleId] || { title: 'Module inconnu', subjects: [] });
const completedCount = computed(() => moduleData.value.subjects.filter(s => s.completed).length);
const progressPercentage = computed(() => Math.round((completedCount.value / (moduleData.value.subjects.length || 1)) * 100));
</script>

<style scoped>
.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.module-list .ue-card {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 16px;
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px 14px;
  box-shadow: 0 4px 20px rgba(18, 14, 58, 0.07);
  border: 1px solid #f0eef8;
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.module-list .ue-card:hover {
  box-shadow: 0 8px 28px rgba(18, 14, 58, 0.12);
  transform: translateY(-2px);
}

.module-list .left-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #ece9f8;
  color: #4e3cb2;
  display: grid;
  place-items: center;
  align-self: center;
}

.module-list .content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.module-list .meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}

.module-list .code-badge {
  font-size: 11px;
  font-weight: 700;
  color: #5b4fcf;
  background: #eeebfa;
  border-radius: 6px;
  padding: 2px 7px;
  letter-spacing: 0.5px;
}

.module-list .top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.module-list .title-block {
  min-width: 0;
}

.module-list .ue-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: #1e1848;
}

.module-list .subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  color: #8c89a4;
}

.module-list .right-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.module-list .deadline-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
  padding: 4px 10px;
  white-space: nowrap;
}

.module-list .deadline-pill--danger {
  color: #dc2626;
  background: #fef2f2;
}

.module-list .deadline-pill--ok {
  color: #059669;
  background: #ecfdf5;
}

.module-list .action-btn {
  background: #2f0d73;
  color: #fff;
  border: none;
  padding: 9px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.module-list .action-btn:hover {
  background: #7c3aed;
}

.module-list .complete-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  font-weight: 700;
  background: #ecfdf5;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #d1fae5;
  font-size: 14px;
}

@media (max-width: 900px) {
  .module-list .ue-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .module-list .left-icon {
    width: 44px;
    height: 44px;
  }

  .module-list .top-row {
    flex-direction: column;
  }

  .module-list .right-col {
    width: 100%;
    align-items: flex-start;
  }
}
</style>