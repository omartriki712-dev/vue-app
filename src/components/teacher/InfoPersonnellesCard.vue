<template>
  <div class="card">
    <div class="card-title">
      <!-- User icon -->
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
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span>Informations personnelles</span>
    </div>

    <ul class="info-list">
      <!-- Email -->
      <li class="info-row">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="row-icon"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <div>
          <span class="label">Email</span>
          <span class="value">{{ email }}</span>
        </div>
      </li>

      <!-- Nom -->
      <li class="info-row">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="row-icon"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <div>
          <span class="label">Nom</span>
          <span class="value">{{ nom }}</span>
        </div>
      </li>

      <!-- Prénom -->
      <li class="info-row">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="row-icon"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <div>
          <span class="label">Prénom</span>
          <span class="value">{{ prenom }}</span>
        </div>
      </li>

      <!-- Matières enseignées -->
      <li class="info-row">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="row-icon"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <div>
          <span class="label">Matières enseignées (année en cours)</span>
          <span class="value">{{ nbMatieres }} matière{{ nbMatieres > 1 ? 's' : '' }}</span>
        </div>
      </li>

      <!-- Matières évaluées -->
      <li class="info-row">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="row-icon"
        >
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <div>
          <span class="label">Matières déjà évaluées (année en cours)</span>
          <span class="value">{{ nbEvaluees }} matière{{ nbEvaluees > 1 ? 's' : '' }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  email: string
  nom: string
  prenom: string
  nbMatieres: number
  nbEvaluees: number
}>()
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #eceaf5;
  border-radius: 16px;
  padding: 22px 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4e3cb2;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 18px;
}

.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0eef8;
}

.info-row:last-child {
  border-bottom: none;
}

.row-icon {
  color: #9893b0;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-row div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: 11px;
  color: #9893b0;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.value {
  font-size: 14px;
  color: #1e1848;
  font-weight: 500;
}
</style>
