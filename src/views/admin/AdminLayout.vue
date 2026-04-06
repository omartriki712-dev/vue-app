<template>
  <div class="layout-container">
    <AdminSidebar @collapse="sidebarCollapsed = $event" />

    <main class="layout-main" :class="sidebarCollapsed ? 'ml-[72px]' : 'ml-64'">
      <header class="layout-header">
        <div>
          <h1 class="header-title">Administration ISIS</h1>
          <p class="header-subtitle">Gestion des évaluations et statistiques</p>
        </div>
        
        <div class="header-actions">
          <div class="search-wrapper">
            <Search class="search-icon" />
            <input type="text" placeholder="Rechercher..." class="search-input" />
          </div>
          <button class="btn-export">
            <Download class="h-4 w-4" />
            Exporter Excel
          </button>
        </div>
      </header>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminSidebar from '../../components/admin/AdminSideBar.vue';
import { Search, Download } from 'lucide-vue-next';

const sidebarCollapsed = ref(false);
</script>

<style scoped>
.layout-container {
  position: relative;
  min-height: 100vh;
  background-color: #fcfcfc;
}

.layout-main {
  padding: 2rem;
  transition: margin-left 0.25s ease;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c0845;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #5f527a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.search-input {
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2f0d73;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export:hover {
  background-color: #1c0845;
}

.btn-export:active {
  transform: scale(0.95);
}
</style>