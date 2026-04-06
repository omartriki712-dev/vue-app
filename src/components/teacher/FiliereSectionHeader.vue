<template>
  <div class="section-header">
    <div class="icon-wrapper" :class="variant">
      <!-- Graduation cap icon for FIE -->
      <svg
        v-if="variant === 'fie'"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
      <!-- Briefcase icon for FIA -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="12" />
        <path d="M2 12h20" />
      </svg>
    </div>
    <div class="text">
      <span class="label">{{ label }}</span>
      <span class="subtitle">{{ subtitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  subtitle: string
  variant: 'fie' | 'fia'
}>()
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 12px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.icon-wrapper.fie {
  background: #eeeaf9;
  color: #5b4fcf;
}

.icon-wrapper.fia {
  background: #fde8df;
  color: #c05020;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.label {
  font-size: 16px;
  font-weight: 700;
  color: #1e1848;
}

.subtitle {
  font-size: 12px;
  color: #8f8ba9;
}
</style>
