<template>
  <header class="dashboard-header">
    <div class="left">
      <h1>Bonjour, {{ prenom }} {{ nom }} 👋</h1>
      <p class="sub">Espace enseignant</p>
      <p class="breadcrumb">
        <template v-for="(item, index) in breadcrumbs" :key="`${item.label}-${index}`">
          <button
            v-if="item.to && !item.current"
            type="button"
            class="bc-link"
            @click="router.push(item.to)"
          >
            {{ item.label }}
          </button>
          <span v-else :class="item.current ? 'bc-current' : 'bc-text'">
            {{ item.label }}
          </span>
          <span v-if="index < breadcrumbs.length - 1" class="bc-sep">›</span>
        </template>
      </p>
    </div>

    <div class="user-box">
      <span class="role">Espace Enseignant</span>
      <span class="email">{{ email }}</span>
      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'

type BreadcrumbItem = {
  label: string
  to?: RouteLocationRaw
  current?: boolean
}

defineProps<{
  prenom: string
  nom: string
  email: string
  breadcrumbs: BreadcrumbItem[]
}>()

const router = useRouter()
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  font-family:
    ui-sans-serif,
    system-ui,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
}

.left {
  min-width: 260px;
}

.left h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: #241b53;
  line-height: 1.15;
}

.sub {
  margin: 4px 0 8px;
  color: #8d88a4;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb {
  margin: 0;
  font-size: 13px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.bc-link {
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  color: #6f6990;
  cursor: pointer;
}

.bc-link:hover {
  color: #4e3cb2;
  text-decoration: underline;
}

.bc-text {
  color: #6f6990;
}

.bc-sep {
  color: #c4baf0;
}

.bc-current {
  color: #2d2455;
  font-weight: 600;
}

.user-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.role {
  color: #6f6a88;
  font-size: 12px;
  font-weight: 500;
}

.email {
  background: #fff;
  border: 1px solid #edeaf7;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #3e3862;
  max-width: 100%;
  overflow-wrap: anywhere;
}

@media (max-width: 980px) {
  .left h1 {
    font-size: 28px;
  }

  .user-box {
    align-items: flex-start;
  }
}

@media (max-width: 760px) {
  .left {
    min-width: 0;
  }

  .left h1 {
    font-size: 26px;
  }

  .sub {
    font-size: 13px;
  }

  .breadcrumb {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .left h1 {
    font-size: 22px;
  }

  .email {
    font-size: 11px;
    padding: 7px 10px;
  }
}
</style>
