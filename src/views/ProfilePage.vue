<template>
  <div class="relative min-h-screen bg-[#fcfcfc]">
    <TheSidebar activePage="Mon Profil" />

    <main class="ml-64 p-12">
      <div class="mb-10 ml-4">
        <h1 class="text-[32px] font-bold text-[#1c0845]">Mon Profil</h1>
        <p class="text-[#5f527a] text-sm font-medium">Gérez vos informations et suivez vos récompenses</p>
      </div>

      <div class="bg-white p-10 rounded-[45px] border border-[#e4e0eb66] shadow-sm flex flex-col md:flex-row items-center gap-10 mb-10 transition-all hover:shadow-md relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#2f0d73]/5 rounded-bl-[100px]"></div>
        
        <div class="w-32 h-32 bg-gradient-to-br from-[#2f0d73] to-[#7c3aed] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-purple-900/10 border-4 border-white relative z-10">
          JD
        </div>
        
        <div class="space-y-4 text-center md:text-left relative z-10">
          <div class="space-y-1">
            <h2 class="text-3xl font-bold text-[#1c0845]">Jean Dupont</h2>
            <p class="text-[#5f527a] text-lg font-medium opacity-80">jean.dupont@etud.univ-jfc.fr</p>
          </div>
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
            <span class="px-5 py-1.5 bg-[#2f0d73] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">FIE 3</span>
            <span class="px-5 py-1.5 bg-[#f2f1f4] text-[#5f527a] text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">DSIA</span>
            <span class="px-5 py-1.5 bg-[#f2f1f4] text-[#5f527a] text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">ISIS</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div class="bg-white p-10 rounded-[45px] border border-[#e4e0eb66] shadow-sm">
          <div class="flex items-center gap-4 mb-10">
            <div class="p-2 bg-gray-50 rounded-lg">
              <User class="h-6 w-6 text-[#1c0845]" />
            </div>
            <h3 class="text-xl font-bold text-[#1c0845]">Informations personnelles</h3>
          </div>

          <div class="space-y-8">
            <div v-for="info in personalInfo" :key="info.label" class="flex items-start gap-5 group">
              <div class="mt-1 p-2.5 rounded-xl bg-gray-50 text-[#5f527a] group-hover:bg-[#2f0d73] group-hover:text-white transition-all duration-300">
                <component :is="info.icon" class="h-5 w-5" />
              </div>
              <div class="flex-1 border-b border-gray-50 pb-4">
                <p class="text-[10px] uppercase tracking-[0.15em] text-[#5f527a]/60 font-black mb-1">{{ info.label }}</p>
                <p class="text-base font-bold text-[#1c0845]">{{ info.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-10 rounded-[45px] border border-[#e4e0eb66] shadow-sm flex flex-col">
          <div class="flex items-center gap-4 mb-10">
            <div class="p-2 bg-amber-50 rounded-lg">
              <Trophy class="h-6 w-6 text-[#f59e0b]" />
            </div>
            <h3 class="text-xl font-bold text-[#1c0845]">Récompenses & Stats</h3>
          </div>

          <div class="grid grid-cols-2 gap-6 flex-1">
            <div v-for="stat in stats" :key="stat.label" class="p-5 rounded-[30px] border border-gray-50 bg-[#fcfbfc] hover:border-purple-100 transition-colors">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4', stat.bgColor]">
                <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]" />
              </div>
              <p class="text-[10px] uppercase tracking-wider text-[#5f527a] font-black mb-1">{{ stat.label }}</p>
              <p class="text-xl font-black text-[#1c0845]">{{ stat.value }}</p>
            </div>
          </div>

          <div class="mt-10 bg-gradient-to-br from-[#f8f7f9] to-[#ffffff] p-8 rounded-[35px] border border-[#e4e0eb66] shadow-inner">
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-4">
              <span class="text-[#2f0d73]">Bronze</span>
              <span class="text-gray-400">Argent</span>
            </div>
            <div class="w-full bg-white h-3 rounded-full overflow-hidden mb-4 border border-gray-100">
              <div class="bg-gradient-to-r from-[#2f0d73] to-[#7c3aed] h-full rounded-full w-[60%] shadow-lg"></div>
            </div>
            <div class="flex items-center justify-center gap-2">
              <TrendingUp class="w-3 h-3 text-[#5f527a]" />
              <p class="text-[11px] font-black text-[#5f527a] tracking-widest uppercase">10 crédits restants</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import TheSidebar from '../components/TheSidebar.vue';
import { 
  User, Mail, Calendar, BookOpen, 
  Trophy, Flame, TrendingUp, Award, GraduationCap 
} from "lucide-vue-next";

const personalInfo = [
  { icon: Mail, label: "Email Institutionnel", value: "jean.dupont@etud.univ-jfc.fr" },
  { icon: GraduationCap, label: "Cycle d'étude", value: "FIE 3 (Ingénieur)" },
  { icon: BookOpen, label: "Spécialisation", value: "DSIA" },
  { icon: Calendar, label: "Année d'inscription", value: "2023 - 2024" },
];

const stats = [
  { icon: Award, label: "Crédits", value: "15", bgColor: "bg-purple-100/50", iconColor: "text-purple-700" },
  { icon: BookOpen, label: "Évals", value: "3", bgColor: "bg-blue-100/50", iconColor: "text-blue-700" },
  { icon: Flame, label: "Série", value: "1 jour", bgColor: "bg-orange-100/50", iconColor: "text-orange-700" },
  { icon: TrendingUp, label: "Niveau", value: "Bronze", bgColor: "bg-yellow-100/50", iconColor: "text-yellow-700" },
];
</script>

<style scoped>
/* Effet d'entrée fluide */
main {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
