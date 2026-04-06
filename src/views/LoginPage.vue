<template>
  <div class="relative min-h-screen bg-[#fcfcfc] flex flex-col font-jakarta">
    <TheNavbar />

    <main class="flex-1 flex items-center justify-center pt-[100px] pb-[60px]">
      <div class="w-full max-w-[448px] px-4">
        <div class="flex justify-center mb-5">
          <div class="h-10 w-[72.69px] bg-[url(/isis-2.png)] bg-cover bg-center cursor-pointer" @click="$router.push('/')" />
        </div>

        <h1 class="text-2xl font-bold text-[#1c0845] text-center mb-2 tracking-tight">
          Connexion
        </h1>
        <p class="text-base text-[#5f527a] text-center mb-6">
          Utilisez votre adresse email ISIS
        </p>

        <div class="bg-white rounded-2xl border border-[#e4e0eb] shadow-xl overflow-hidden transition-all" :class="{ 'shake': error }">
          <div class="p-8">
            <div class="space-y-6">
              
              <div v-if="error" class="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-fade-in">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ error }}
              </div>

              <div class="space-y-2">
                <label for="email" class="text-sm font-medium text-[#1c0845] block">
                  Adresse email institutionnelle
                </label>
                <div class="relative group">
                  <img src="/svg.svg" alt="Email icon" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    id="email" 
                    type="email" 
                    v-model="email" 
                    placeholder="nom.prenom@etud.univ-jfc.fr"
                    class="h-12 w-full pl-10 bg-[#fcfcfc] border border-[#e4e0eb] rounded-xl text-sm focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="password" class="text-sm font-medium text-[#1c0845] block">
                  Mot de passe
                </label>
                <div class="relative group">
                  <img src="/vector.svg" alt="Lock icon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    id="password" 
                    type="password" 
                    v-model="password" 
                    placeholder="••••••••"
                    @keyup.enter="handleLogin"
                    class="h-12 w-full pl-10 bg-[#fcfcfc] border border-[#e4e0eb] rounded-xl text-sm focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="relative flex items-center">
                  <input 
                    id="consent" 
                    type="checkbox" 
                    v-model="consent" 
                    class="h-5 w-5 rounded-md border-[#e4e0eb] text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer transition-colors" 
                  />
                </div>
                <label for="consent" class="text-xs text-[#5f527a] cursor-pointer leading-relaxed">
                  J'accepte le stockage anonyme de mes données conformément à la politique de l'école.
                </label>
              </div>

              <button 
                @click="handleLogin" 
                :disabled="loading"
                class="w-full h-12 bg-gradient-to-r from-[#2f0d73] to-[#8052da] text-white font-bold rounded-xl shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="!loading">Se connecter</span>
                <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              </button>

              <div class="bg-[#f2f1f480] rounded-xl border border-[#e4e0eb] p-4">
                <div class="flex items-start gap-3">
                  <img src="/SVG2.svg" alt="Shield icon" class="w-5 h-5 mt-0.5" />
                  <div>
                    <h3 class="text-sm font-medium text-[#1c0845] mb-1">Connexion sécurisée</h3>
                    <p class="text-xs text-[#5f527a]">Votre mot de passe vous a été envoyé par email lors de votre inscription.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-8 mt-8 opacity-60">
          <div v-for="(badge, index) in securityBadges" :key="index" class="flex items-center gap-2">
            <img src="/SVG3.svg" alt="Security icon" class="w-4 h-4" />
            <span class="text-xs font-bold text-[#5f527a] uppercase tracking-wider">{{ badge.text }}</span>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TheNavbar from '../components/student/TheNavbar.vue';
import TheFooter from '../components/student/TheFooter.vue';

const router = useRouter();

const email = ref("");
const password = ref("");
const consent = ref(false);
const error = ref("");
const loading = ref(false);

const securityBadges = [
  { text: "Données chiffrées" },
  { text: "RGPD Compliant" },
];

const handleLogin = () => {
  error.value = ""; // Reset error
  
  // Validation Consentement
  if (!consent.value) {
    error.value = "Veuillez accepter le stockage des données.";
    return;
  }

  // Validation Champs Vides
  if (!email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  // Validation Email Institutionnel (Simple Regex)
  const isIsisEmail = email.value.endsWith('@etud.univ-jfc.fr') || email.value.endsWith('@univ-jfc.fr');
  if (!isIsisEmail) {
    error.value = "Veuillez utiliser votre email @univ-jfc.fr";
    return;
  }

  // Simulation de chargement
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push('/student');
  }, 1000);
};
</script>

<style scoped>
.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
