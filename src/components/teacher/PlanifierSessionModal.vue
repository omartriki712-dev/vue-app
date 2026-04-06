<!-- components/PlanifierSessionModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="overlay" @click.self="emit('update:modelValue', false)">
        <div class="modal" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="#4e3cb2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Planifier la session</span>
            </div>
            <button class="close-btn" @click="emit('update:modelValue', false)" aria-label="Fermer">
              ✕
            </button>
          </div>

          <!-- UE info -->
          <div class="ue-info">
            <span class="ue-code-title"
              ><strong>{{ ueCode }}</strong> — {{ ueTitle }}</span
            >
            <span class="status-tag" :class="`status-tag--${status}`">
              <svg
                viewBox="0 0 24 24"
                width="10"
                height="10"
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

          <p class="statut-actuel-label">Statut actuel</p>

          <!-- Date fields -->
          <div class="date-row">
            <!-- Ouverture : seul champ à saisir -->
            <div class="date-field">
              <label>Date d'ouverture</label>
              <div class="input-wrap" :class="{ filled: localOpen }">
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
                <input type="date" v-model="localOpen" :placeholder="'Sélectionner'" />
              </div>
            </div>

            <!-- Clôture : calculé automatiquement (J+7), lecture seule -->
            <div class="date-field">
              <label>Date de clôture <span class="auto-label">(automatique)</span></label>
              <div class="input-wrap input-wrap--readonly" :class="{ filled: computedClose }">
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
                <span class="readonly-value">
                  {{ computedCloseFormatted || '— sélectionnez une ouverture' }}
                </span>
              </div>
              <p class="close-hint" v-if="computedCloseFormatted">7 jours après l'ouverture</p>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="error">{{ error }}</p>

          <!-- Actions -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="emit('update:modelValue', false)">Annuler</button>
            <button class="btn-confirm" :disabled="!canConfirm" @click="handleConfirm">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  ueCode: string
  ueTitle: string
  status: 'a-planifier' | 'planifie' | 'en-cours'
  openDate?: string
  closeDate?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  confirm: [payload: { openDate: string; closeDate: string }]
}>()

const localOpen = ref(props.openDate ?? '')

// Reset on open
watch(
  () => props.modelValue,
  (v) => {
    if (v) localOpen.value = props.openDate ?? ''
  },
)
watch(
  () => props.openDate,
  (v) => {
    localOpen.value = v ?? ''
  },
)

/** Date de clôture = ouverture + 7 jours (ISO string YYYY-MM-DD) */
const computedClose = computed(() => {
  if (!localOpen.value) return ''
  const d = new Date(localOpen.value)
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
})

/** Affichage de la date de clôture au format jj/mm/aaaa (identique à l'input ouverture) */
const computedCloseFormatted = computed(() => {
  if (!computedClose.value) return ''
  return new Date(computedClose.value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

// Seul l'ouverture est nécessaire pour confirmer
const canConfirm = computed(() => !!localOpen.value)

const error = computed(() => '')

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

function handleConfirm() {
  if (!canConfirm.value) return
  emit('confirm', { openDate: localOpen.value, closeDate: computedClose.value as string })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 15, 55, 0.18);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 20px;
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 48px rgba(18, 14, 58, 0.16);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1e1848;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #9893b0;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}

.close-btn:hover {
  background: #f0eef8;
}

/* UE info */
.ue-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.ue-code-title {
  font-size: 13px;
  color: #4a4270;
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

.statut-actuel-label {
  font-size: 12px;
  color: #a09cb8;
  margin: 0;
}

/* Date row */
.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 4px;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-field label {
  font-size: 12px;
  font-weight: 600;
  color: #5b4fcf;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #e0dcf5;
  border-radius: 10px;
  padding: 9px 12px;
  background: #faf9fe;
  color: #9893b0;
  transition: border-color 0.15s;
}

.input-wrap:focus-within {
  border-color: #7c6fcd;
  background: #fff;
  color: #4e3cb2;
}

.input-wrap.filled {
  color: #2d2455;
  border-color: #c4baf0;
  background: #fff;
}

.input-wrap input[type='date'] {
  border: none;
  background: transparent;
  font-size: 13px;
  color: inherit;
  outline: none;
  width: 100%;
  font-family: inherit;
  cursor: pointer;
}

/* Supprime le style natif webkit */
.input-wrap input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  width: 100%;
  cursor: pointer;
}

.auto-label {
  font-weight: 400;
  color: #a09cb8;
  font-size: 11px;
}

.input-wrap--readonly {
  background: #f5f3fd;
  border-color: #e8e5f5;
  cursor: default;
  color: #6f6990;
}

.readonly-value {
  font-size: 13px;
  color: #6f6990;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-wrap--readonly.filled .readonly-value {
  color: #2d2455;
  font-weight: 500;
}

.close-hint {
  margin: 2px 0 0;
  font-size: 11px;
  color: #a09cb8;
}

.error {
  font-size: 12px;
  color: #d44a35;
  margin: 0;
  padding: 6px 10px;
  background: #fff2f0;
  border-radius: 8px;
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-cancel {
  background: none;
  border: 1.5px solid #e0dcf5;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #6f6990;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover {
  background: #f5f3fd;
}

.btn-confirm {
  background: #40248d;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s,
    opacity 0.15s;
}

.btn-confirm:hover:not(:disabled) {
  background: #5b3db5;
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}
</style>
