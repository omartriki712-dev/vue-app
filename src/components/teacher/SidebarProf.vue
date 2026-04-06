<template>
    <aside
      class="sticky top-0 h-screen bg-white border-r border-[#e4e0eb66] flex flex-col z-50 transition-all duration-250"
      :class="collapsed ? 'w-[72px]' : 'w-64'"
    >
    <!-- Brand Header -->
    <header class="h-20 flex items-center px-5 gap-3 overflow-hidden">
      <img src="/logo-ISIS.png" alt="Logo" class="h-9 w-9 object-contain flex-shrink-0" />
      <div
        class="flex flex-col overflow-hidden transition-all duration-200"
        :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
      >
        <strong class="text-[#221b4c] text-[13px] font-semibold leading-tight truncate">Espace Enseignant</strong>
        <small class="text-[#928da9] text-[11px]">ISIS Eval</small>
      </div>
    </header>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        :title="collapsed ? item.label : ''"
        @click="handleNav(item.to); emit('select', item)"
        :class="[
          'flex items-center gap-3 h-12 px-3 rounded-xl font-medium text-sm transition-all duration-200 w-full',
          item.active
            ? 'bg-[#2f0d73] text-white shadow-lg shadow-purple-900/20'
            : 'text-[#5f527a] hover:bg-gray-50'
        ]"
      >
        <!-- Home -->
        <svg v-if="item.key === 'home'" class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <!-- History -->
        <svg v-else-if="item.key === 'history'" class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <!-- Profile fallback -->
        <svg v-else class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>

        <span
          class="transition-all duration-200 overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- Footer: collapse + logout -->
    <footer class="p-3 border-t border-[#e4e0eb66] flex flex-col gap-1">
      <!-- Collapse toggle -->
      <button
        type="button"
        @click="collapsed = !collapsed"
        :title="collapsed ? 'Ouvrir le menu' : 'Réduire'"
        class="flex items-center gap-3 h-10 px-3 rounded-xl text-[#5f527a] hover:bg-gray-50 transition-colors w-full"
      >
        <!-- Chevron left when open, right when collapsed -->
        <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline v-if="!collapsed" points="15 18 9 12 15 6" />
          <polyline v-else points="9 18 15 12 9 6" />
        </svg>
        <span
          class="text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          Réduire
        </span>
      </button>

      <!-- Logout -->
      <button
        type="button"
        @click="handleLogout"
        class="flex items-center gap-3 h-12 px-3 rounded-xl text-[#5f527a] hover:bg-red-50 hover:text-red-600 transition-colors w-full"
      >
        <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span
          class="text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          {{ logoutLabel ?? 'Déconnexion' }}
        </span>
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type SidebarItem = {
  key: string
  label: string
  active?: boolean
  to?: string
}

const emit = defineEmits<{
  select: [item: SidebarItem]
}>()

defineProps<{
  items: Array<SidebarItem>
  logoutLabel?: string
}>()

const collapsed = ref(false)
const router = useRouter()

function handleNav(to?: string) {
  if (!to || to === router.currentRoute.value.path) return
  router.push(to)
}

function handleLogout() {
  router.push('/')
}
</script>