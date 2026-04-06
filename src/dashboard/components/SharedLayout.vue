<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <aside class="fixed top-0 left-0 w-64 h-screen bg-white border-r border-[#e4e0eb66] flex flex-col z-50">
      <router-link class="h-20 flex items-center px-8 cursor-pointer" to="/">
        <img src="/isis-2.png" alt="Logo" class="h-10 w-auto" />
      </router-link>
      <nav class="flex-1 px-4 py-4 space-y-2 flex flex-col">
        <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.route"
            :class="[
          'flex items-center gap-3 h-12 px-4 rounded-xl font-medium text-sm transition-all duration-200',
          activePage === item.name
            ? 'bg-[#2f0d73] text-white shadow-lg shadow-purple-900/20'
            : 'text-[#5f527a] hover:bg-gray-50'
        ]"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <footer class="p-6 border-t border-[#e4e0eb66]">
        <button @click="logout" class="flex items-center w-full gap-3 h-12 px-4 rounded-xl text-[#5f527a] hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut class="h-5 w-5" />
          <span class="font-medium text-sm">Déconnexion</span>
        </button>
      </footer>
    </aside>
    <main class="ml-64 p-12">
      <div class="flex justify-between items-start mb-10">
        <div class="ml-4">
          <h1 class="text-3xl font-bold text-[#1c0845] mb-1">Bonjour, {{user.role}} 👋</h1>
          <div class="flex items-center gap-2 mt-4 text-[#7c3aed] text-xs font-bold bg-purple-50 w-fit px-3 py-1 rounded-full">
            <Home class="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#e4e0eb66] shadow-sm">
          <div class="w-8 h-8 rounded-full bg-[#2f0d73] flex items-center justify-center text-white text-[10px] font-bold">
            {{user.name.charAt(0)}} {{user.name.charAt(user.name.length - 1)}}
          </div>
          <span class="text-sm text-[#5f527a] font-semibold">{{user.email}}</span>
        </div>
      </div>
      <slot />

    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {Home, LogOut} from "lucide-vue-next";
const router = useRouter();
defineProps(['menuItems', 'activePage', 'user', 'children']);
const logout = () => router.push('/login');
</script>

<style scoped>
/* Animation d'entrée pour les cartes */
.grid > div {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }

@keyframes slideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
