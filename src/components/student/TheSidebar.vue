<template>
  <aside
    class="fixed top-0 left-0 h-screen bg-white border-r border-[#e4e0eb66] flex flex-col z-50 transition-all duration-250"
    :class="collapsed ? 'w-[72px]' : 'w-64'"
  >
    <header class="h-20 flex items-center px-5 gap-3 overflow-hidden cursor-pointer" @click="router.push('/')">
      <img src="/logo-ISIS.png" alt="Logo" class="h-9 w-9 object-contain flex-shrink-0" />
      <div
        class="flex flex-col overflow-hidden transition-all duration-200"
        :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
      >
        <strong class="text-[#221b4c] text-[13px] font-semibold leading-tight truncate">Espace Etudiant</strong>
        <small class="text-[#928da9] text-[11px]">ISIS Eval</small>
      </div>
    </header>

    <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
      <button
        v-for="(item, index) in menuItems"
        :key="index"
        @click="handleNav(item.route)"
        :title="collapsed ? item.label : ''"
        :class="[
          'flex items-center gap-3 h-12 px-3 rounded-xl font-medium text-sm transition-all duration-200 w-full',
          isActive(item.route)
            ? 'bg-[#2f0d73] text-white shadow-lg shadow-purple-900/20'
            : 'text-[#5f527a] hover:bg-gray-50'
        ]"
      >
        <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
        <span
          class="transition-all duration-200 overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <footer class="p-3 border-t border-[#e4e0eb66] flex flex-col gap-1">
      <!-- Collapse toggle -->
      <button
        type="button"
        @click="toggleCollapse"
        :title="collapsed ? 'Ouvrir le menu' : 'Réduire'"
        class="flex items-center gap-3 h-10 px-3 rounded-xl text-[#5f527a] hover:bg-gray-50 transition-colors w-full"
      >
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
        @click="logout"
        :title="collapsed ? 'Déconnexion' : ''"
        class="flex items-center w-full gap-3 h-12 px-3 rounded-xl text-[#5f527a] hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut class="h-5 w-5 flex-shrink-0" />
        <span
          class="font-medium text-sm transition-all duration-200 overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          Déconnexion
        </span>
      </button>
    </footer>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Home, History, BarChart3, User, LogOut } from "lucide-vue-next";

defineProps({ activePage: String });
const emit = defineEmits(['collapse']);

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  emit('collapse', collapsed.value);
}

const menuItems = [
  { icon: Home,     label: "Accueil",              route: "/student" },
  { icon: History,  label: "Historique",            route: "/student/history" },
  { icon: BarChart3,label: "Mes Résultats & Stats", route: "/student/stats" },
  { icon: User,     label: "Mon Profil",            route: "/student/profile" },
];

const isActive = (r) => route.path === r;
const handleNav = (r) => router.push(r);
const logout = () => router.push('/login');
</script>
