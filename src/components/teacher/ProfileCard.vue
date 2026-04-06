<template>
  <div class="profile-card">
    <div class="avatar" :style="{ background: avatarBg }">
      <span class="initials">{{ initials }}</span>
    </div>

    <div class="info">
      <h2 class="full-name">{{ prenom }} {{ nom }}</h2>
      <p class="email">{{ email }}</p>
      <div class="badges">
        <span v-if="role" class="badge badge-role">{{ role }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  prenom: string
  nom: string
  email: string
  role?: string
}>()

const initials = computed(() => `${props.prenom.charAt(0)}${props.nom.charAt(0)}`.toUpperCase())

// Deterministic pastel-ish color from name
const avatarBg = computed(() => {
  const colors = ['#7c6bb5', '#5b7fcf', '#c2617a', '#4a9e8a', '#9b6b35']
  const idx = (props.prenom.charCodeAt(0) + props.nom.charCodeAt(0)) % colors.length
  return colors[idx]
})
</script>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  border: 1px solid #eceaf5;
  border-radius: 16px;
  padding: 24px 28px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.initials {
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.full-name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e1848;
}

.email {
  margin: 0;
  font-size: 13px;
  color: #7b7698;
}

.badges {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.badge {
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 3px 10px;
}

.badge-role {
  background: #e8e4f7;
  color: #4e3cb2;
}

.badge-filiere {
  background: #e4f0fb;
  color: #2e6db4;
}
</style>
