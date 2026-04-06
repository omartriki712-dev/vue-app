<!-- filepath: c:\Users\chhak\Documents\ISIS\S6\ptut\espace_prof\espace_prof\src\components\AnneeAcademique.vue -->
<template>

    <div class="flex justify-center mb-12">
        <div class="bg-white p-6 rounded-[32px] border border-[#e4e0eb66] shadow-sm flex items-center gap-6 w-fit px-12 group hover:border-[#7c3aed] transition-colors">
          <div class="bg-[#f2f1f4] p-4 rounded-2xl group-hover:bg-purple-50 transition-colors">
            <Calendar class="h-8 w-8 text-[#1c0845] group-hover:text-[#7c3aed]" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-[#1c0845]">{{ startYear }}–{{ endYear }}</h2>
            <p class="text-[#5f527a] text-sm font-bold uppercase tracking-widest opacity-60">Année académique</p>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Home, ChevronRight, Calendar } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    startYear?: number
    endYear?: number
  }>(),
  {
    startYear: 2025,
    endYear: 2026,
  },
)

const startYear = props.startYear
const endYear = props.endYear
</script>

<style scoped>
.academic-year-card {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border-radius: 14px;
  padding: 14px 20px;
  box-shadow: 0 8px 28px rgba(22, 14, 63, 0.08);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: #f0eefb;
  border-radius: 10px;
  color: #5b4fcf;
  flex-shrink: 0;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.year-label {
  font-size: 25px;
  font-weight: 700;
  color: #20174f;
  line-height: 1.1;
}

.subtitle {
  font-size: 12.5px;
  color: #8f8ba9;
}
</style>
