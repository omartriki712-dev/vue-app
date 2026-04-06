<template>
  <div class="mb-8">
    <div class="flex justify-between text-xs font-bold text-[#1c0845] mb-2">
      <span>Question {{ current + 1 }} sur {{ total }}</span>
      <span>{{ Math.round(percentage) }}%</span>
    </div>
    <div class="w-full bg-[#f2f1f4] h-2 rounded-full overflow-hidden">
      <div 
        class="bg-[#7c3aed] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(124,58,237,0.3)]" 
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps(['current', 'total', 'percentage']);
</script>