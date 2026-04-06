<script setup>
import TheNavbar from "../components/TheNavbar.vue";
import TheFooter from "../components/TheFooter.vue";
</script>

<template>
  <div class="relative min-h-screen bg-[#fcfcfc] flex flex-col font-jakarta">
    <TheNavbar />
    <main class="pt-[65px]">
      <router-view />
    </main>
    <main class="flex-1 flex items-center justify-center pt-[100px] pb-[60px]">
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>

</style>
