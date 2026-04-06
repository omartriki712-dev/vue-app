<template>
  <aside class="fixed top-0 left-0 w-64 h-screen bg-white border-r border-[#e4e0eb66] flex flex-col z-50">
    <header class="h-20 flex items-center px-8 cursor-pointer" @click="router.push('/')">
      <img src="/isis-2.png" alt="Logo" class="h-10 w-auto" />
    </header>

    <nav class="flex-1 px-4 py-4 space-y-2 flex flex-col">
      <button
        v-for="(item, index) in menuItems"
        :key="index"
        @click="handleNav(item.route)"
        :class="[
          'flex items-center gap-3 h-12 px-4 rounded-xl font-medium text-sm transition-all duration-200',
          activePage === item.label 
            ? 'bg-[#2f0d73] text-white shadow-lg shadow-purple-900/20' 
            : 'text-[#5f527a] hover:bg-gray-50'
        ]"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <footer class="p-6 border-t border-[#e4e0eb66]">
      <button @click="logout" class="flex items-center w-full gap-3 h-12 px-4 rounded-xl text-[#5f527a] hover:bg-red-50 hover:text-red-600 transition-colors">
        <LogOut class="h-5 w-5" />
        <span class="font-medium text-sm">Déconnexion</span>
      </button>
    </footer>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Home, History, BarChart3, User, LogOut } from "lucide-vue-next";

defineProps({
  activePage: String
});

const router = useRouter();

// Labels updated to match Figma precisely
const menuItems = [
  { icon: Home, label: "Accueil", route: "/dashboard/student" },
  { icon: History, label: "Historique", route: "/dashboard/student/history" },
  { icon: BarChart3, label: "Mes Résultats & Stats", route: "/dashboard/student/stats" },
  { icon: User, label: "Mon Profil", route: "/dashboard/student/profile" },
];

const handleNav = (route) => router.push(route);
const logout = () => router.push('/login');
</script>
