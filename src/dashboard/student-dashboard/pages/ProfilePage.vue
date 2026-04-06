<script setup>
import { ref, onMounted, computed } from "vue";
import {
  User, Mail, Calendar, BookOpen,
  Trophy, Flame, TrendingUp, Award, GraduationCap, Loader2, Edit2, Check, X
} from "lucide-vue-next";
import { getProfile, updateProfile } from "../actions/student_actions.js";

const profile = ref(null);
const loading = ref(true);
const saving = ref(false);
const isEditing = ref(false);

const editForm = ref({
  firstName: "",
  lastName: "",
  specialization: ""
});

onMounted(async () => {
  await fetchProfile();
});

const fetchProfile = async () => {
  try {
    loading.value = true;
    const res = await getProfile();
    profile.value = {
      email: res.user.email,
      firstName: res.firstName,
      lastName: res.lastName,
      specialization: res.studentPromotion.speciality,
      inscriptionYear: res.inscriptionYear
    };
    // Initialize edit form
    editForm.value = {
      firstName: res.firstName,
      lastName: res.lastName,
      specialization: res.studentPromotion.speciality,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
  } finally {
    loading.value = false;
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  // Reset form
  editForm.value = {
    firstName: profile.value.firstName,
    lastName: profile.value.lastName,
    specialization: profile.value.specialization
  };
};

const handleUpdateProfile = async () => {
  try {
    saving.value = true;
    const res = await updateProfile(editForm.value);
    profile.value = res;
    isEditing.value = false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
  } finally {
    saving.value = false;
  }
};

const personalInfo = computed(() => {
  if (!profile.value) return [];
  return [
    { icon: Mail, label: "Email Institutionnel", value: profile.value.email || "Non renseigné" },
    { icon: GraduationCap, label: "Cycle d'étude", value: profile.value.promotionName || "Non renseigné" },
    { icon: BookOpen, label: "Spécialisation", value: profile.value.specialization || "Non renseigné" },
    { icon: Calendar, label: "Année d'inscription", value: profile.value.inscriptionYear || "Non renseigné" },
  ];
});

const stats = computed(() => {
  if (!profile.value) return [];
  return [
    { icon: Award, label: "Crédits", value: profile.value.credits || "0", bgColor: "bg-purple-100/50", iconColor: "text-purple-700" },
    { icon: BookOpen, label: "Évals", value: profile.value.evaluationsCount || "0", bgColor: "bg-blue-100/50", iconColor: "text-blue-700" },
    { icon: Flame, label: "Série", value: `${profile.value.streak || 0} jours`, bgColor: "bg-orange-100/50", iconColor: "text-orange-700" },
    { icon: TrendingUp, label: "Niveau", value: profile.value.level || "Bronze", bgColor: "bg-yellow-100/50", iconColor: "text-yellow-700" },
  ];
});
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 class="w-10 h-10 text-[#7c3aed] animate-spin mb-4" />
    <p class="text-[#5f527a] font-medium">Chargement du profil...</p>
  </div>

  <div v-else-if="!profile" class="text-center py-12">
    <p class="text-[#5f527a]">Impossible de charger le profil.</p>
  </div>

  <div v-else>
    <div class="mb-10 ml-4 flex justify-between items-end">
      <div>
        <h1 class="text-[32px] font-bold text-[#1c0845]">Mon Profil</h1>
        <p class="text-[#5f527a] text-sm font-medium">Gérez vos informations et suivez vos récompenses</p>
      </div>

      <button v-if="!isEditing" @click="startEditing" class="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#e4e0eb] rounded-xl text-sm font-bold text-[#1c0845] hover:bg-gray-50 transition-colors shadow-sm">
        <Edit2 class="w-4 h-4" /> Modifier
      </button>
      <div v-else class="flex gap-2">
        <button @click="cancelEditing" class="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors shadow-sm">
          <X class="w-4 h-4" /> Annuler
        </button>
        <button @click="handleUpdateProfile" :disabled="saving" class="flex items-center gap-2 px-6 py-2.5 bg-[#2f0d73] rounded-xl text-sm font-bold text-white hover:bg-[#7c3aed] transition-colors shadow-sm disabled:opacity-50">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <Check v-else class="w-4 h-4" /> Enregistrer
        </button>
      </div>
    </div>

    <div class="bg-white p-10 rounded-[45px] border border-[#e4e0eb66] shadow-sm flex flex-col md:flex-row items-center gap-10 mb-10 transition-all hover:shadow-md relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-[#2f0d73]/5 rounded-bl-[100px]"></div>

      <div class="w-32 h-32 bg-gradient-to-br from-[#2f0d73] to-[#7c3aed] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-purple-900/10 border-4 border-white relative z-10">
        {{ profile.firstName?.charAt(0) || 'U' }}
      </div>

      <div class="space-y-4 text-center md:text-left relative z-10 flex-grow">
        <div v-if="!isEditing" class="space-y-1">
          <h2 class="text-3xl font-bold text-[#1c0845]">{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p class="text-[#5f527a] text-lg font-medium opacity-80">{{ profile.email }}</p>
        </div>
        <div v-else class="space-y-4 max-w-md">
          <div class="flex gap-4">
            <div class="flex-1 space-y-1">
              <label class="text-[10px] font-black uppercase text-[#5f527a]">Prénom</label>
              <input v-model="editForm.firstName" class="w-full px-4 py-2 bg-gray-50 border border-[#e4e0eb] rounded-xl focus:ring-2 focus:ring-[#7c3aed] outline-none font-bold text-[#1c0845]" />
            </div>
            <div class="flex-1 space-y-1">
              <label class="text-[10px] font-black uppercase text-[#5f527a]">Nom</label>
              <input v-model="editForm.lastName" class="w-full px-4 py-2 bg-gray-50 border border-[#e4e0eb] rounded-xl focus:ring-2 focus:ring-[#7c3aed] outline-none font-bold text-[#1c0845]" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-center md:justify-start gap-3">
          <span class="px-5 py-1.5 bg-[#2f0d73] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">{{ profile.promotionName }}</span>
          <span v-if="!isEditing && profile.specialization" class="px-5 py-1.5 bg-[#f2f1f4] text-[#5f527a] text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">{{ profile.specialization }}</span>
          <div v-else-if="isEditing" class="flex-1 max-w-[150px]">
             <input v-model="editForm.specialization" placeholder="Spécialisation" class="w-full px-4 py-1.5 bg-gray-50 border border-[#e4e0eb] rounded-full text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#7c3aed] outline-none" />
          </div>
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
            <p class="text-[11px] font-black text-[#5f527a] tracking-widest uppercase">{{ profile.nextLevelCredits || 0 }} crédits restants</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
