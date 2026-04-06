<template>
  <li class="matiere-row" @click="goToResultats" role="button" tabindex="0" @keydown.enter="goToResultats">
    <div class="left">
      <span class="name">{{ matiere.nom }}</span>
      <span class="code">{{ matiere.code }}</span>
    </div>
    <div class="right">
      <span class="promo">{{ matiere.promotion }}</span>
      <div class="reponses">
        <span class="count">{{ matiere.nbReponses }}</span>
        <span class="reponses-label">réponses</span>
      </div>
      <!-- Arrow icon -->
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#b0aacf"
        stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  matiere: {
    nom: string
    code: string
    promotion: string
    nbReponses: number
    year?: number
  }
}>()

const router = useRouter()

function goToResultats() {
  router.push({
    name: 'ResultatsEnseignement',
    params: { code: props.matiere.code },
    query: {
      promo: props.matiere.promotion,
      year: props.matiere.year ?? 2025,
    },
  })
}
</script>

<style scoped>
.matiere-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 10px;
  border-bottom: 1px solid #f0eef8;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.14s;
}

.matiere-row:last-child {
  border-bottom: none;
}

.matiere-row:hover {
  background: #f7f6fc;
}

.matiere-row:focus-visible {
  outline: 2px solid #5b4fcf;
  outline-offset: 2px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: #1e1848;
}

.code {
  font-size: 12px;
  color: #9893b0;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.promo {
  font-size: 12px;
  font-weight: 600;
  color: #5b4fcf;
  background: #eeebfa;
  border-radius: 6px;
  padding: 3px 8px;
}

.reponses {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
}

.count {
  font-size: 18px;
  font-weight: 800;
  color: #1e1848;
  line-height: 1;
}

.reponses-label {
  font-size: 11px;
  color: #9893b0;
}

.arrow-icon {
  opacity: 0.6;
  transition: opacity 0.14s, transform 0.14s;
}

.matiere-row:hover .arrow-icon {
  opacity: 1;
  transform: translateX(2px);
}
</style>
