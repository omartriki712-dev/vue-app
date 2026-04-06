<template>
  <div class="bg-white p-8 rounded-[24px] border border-[#e4e0eb66] shadow-sm">
    <h2 class="text-lg font-bold text-[#1c0845] mb-6">{{ text }}</h2>
    
    <div class="space-y-3">
      <label v-for="option in options" :key="option.id" 
             :class="['flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all', 
                      modelValue === option.value ? 'border-[#7c3aed] bg-purple-50/50 shadow-sm' : 'border-[#e4e0eb66] hover:border-purple-200']">
        
        <div class="flex items-center">
          <input type="radio" 
                 :name="'question-' + text"
                 :value="option.value" 
                 :checked="modelValue === option.value"
                 @change="$emit('update:modelValue', option.value)"
                 class="mr-4 accent-[#7c3aed] w-4 h-4">
          <span class="text-sm font-medium text-[#1c0845]">{{ option.label }}</span>
        </div>

        <div class="flex gap-0.5" v-if="option.stars !== -1">
          <Star v-for="i in 4" :key="i" 
                :class="['w-4 h-4', i <= option.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200']" />
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { Star } from "lucide-vue-next";

// Définition des propriétés (Props)
defineProps({
  text: String,
  options: Array,
  modelValue: [Number, String]
});

// Définition des événements (Emits)
defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Optionnel : tu peux ajouter des styles spécifiques ici */
</style>