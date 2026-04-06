<script setup>
import {Home, History, BarChart3, User} from "lucide-vue-next";
const menuItems = [
  { icon: Home, label: "Accueil", route: "/dashboard/student", name: 'Home' },
  { icon: History, label: "Historique", route: "/dashboard/student/history" },
  { icon: BarChart3, label: "Mes Résultats & Stats", route: "/dashboard/student/stats" },
  { icon: User, label: "Mon Profil", route: "/dashboard/student/profile" },
];
console.log('hello');
const email = localStorage.getItem('email');
const name = localStorage.getItem('name');
</script>

<template>
<SharedLayout :user="{'role': 'student', 'email': email, 'name': name}" :menuItems="menuItems" activePage="Home">
  <router-view />
</SharedLayout>
</template>
<style scoped>
</style>
