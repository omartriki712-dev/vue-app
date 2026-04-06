<!-- components/SessionEvaluation.vue -->
<template>
  <div class="session-bar">
    <div class="session-left">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span class="session-label">Session d'évaluation</span>
      <span class="status-tag" :class="`status-tag--${status}`">
        <svg
          viewBox="0 0 24 24"
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {{ statusLabel }}
      </span>
    </div>

    <button class="btn-gerer" @click="emit('open')">
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      Gérer la session
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'a-planifier' | 'planifie' | 'en-cours'
}>()

const emit = defineEmits<{ open: [] }>()

const statusLabel = computed(() => {
  switch (props.status) {
    case 'a-planifier':
      return 'Non planifié'
    case 'planifie':
      return 'Planifié'
    case 'en-cours':
      return 'En cours'
  }
})
</script>

<style scoped>
.session-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 14px;
  padding: 14px 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.session-left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a4270;
}

.session-label {
  font-size: 14px;
  font-weight: 500;
  color: #2d2455;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  padding: 3px 9px 3px 7px;
}

.status-tag--a-planifier {
  background: #fff2f0;
  color: #d44a35;
}

.status-tag--planifie {
  background: #eef3ff;
  color: #3b62d4;
}

.status-tag--en-cours {
  background: #eaf6ee;
  color: #2a9151;
}

.btn-gerer {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1.5px solid #ddd8f4;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #2d2455;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s;
}

.btn-gerer:hover {
  background: #f5f3fd;
  border-color: #b8aee8;
  transform: translateY(-1px);
}
</style>
