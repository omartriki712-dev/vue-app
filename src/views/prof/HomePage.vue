<template>
  <div class="min-h-screen bg-white">
    <header class="fixed top-0 left-0 right-0 h-[65px] bg-white/80 backdrop-blur-md border-b border-[#e4e0eb66] z-50">
      <div class="h-full max-w-[1400px] mx-auto px-[60px] flex items-center justify-between">
        <div class="h-10 w-[72.69px] bg-[url('/isis-2.png')] bg-cover bg-center cursor-pointer" @click="handleNavigation('/')" />

        <nav class="flex gap-2">
          <button
            v-for="(item, index) in navigationItems"
            :key="index"
            :class="[
              'h-9 px-4 rounded-[10px] font-jakarta font-semibold text-sm transition-all duration-200',
              item.active
                ? 'bg-[#2f0d73] text-white shadow-md'
                : 'text-[#5f527a] hover:bg-gray-100'
            ]"
            @click="handleNavigation(item.route)"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
    </header>

    <main class="pt-[65px]">
      <section class="relative bg-gradient-to-br from-[#6b46c1] via-[#7c3aed] to-[#a855f7] text-white overflow-hidden">
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]"></div>
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
        </div>

        <div class="relative max-w-[1400px] mx-auto px-[60px] py-24 text-center z-10">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 font-jakarta tracking-tight">
            Évaluation des<br />
            <span class="text-[#fbbf24]">Enseignements</span>
          </h1>

          <p class="text-lg mb-10 max-w-2xl mx-auto opacity-90 font-jakarta leading-relaxed">
            Plateforme sécurisée et anonyme pour évaluer vos enseignements à ISIS. <br />
            Votre avis compte pour améliorer la qualité de la formation.
          </p>      

          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              @click="handleNavigation('/login')"
              class="h-14 px-10 bg-[#F56861] hover:bg-[#ff7a74] text-white font-bold text-lg rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 font-jakarta"
            >
              Participer à l'évaluation
            </button>
            <button
              class="h-14 px-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border-2 border-white/30 transition-all font-jakarta"
            >
              En savoir plus 
            </button>
          </div>

          <div class="flex flex-wrap gap-3 justify-center items-center">
            <span
              v-for="year in ['FIE1', 'FIE2', 'FIE3', 'FIE4', 'FIE5', 'FIA3', 'FIA4', 'FIA5']"
              :key="year"
              class="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold font-jakarta border border-white/10 hover:bg-white/30 transition-colors cursor-default"
            >
              {{ year }}
            </span>
          </div>
        </div>

        <div class="w-full h-24 bg-white" style="clip-path: ellipse(70% 100% at 50% 100%)"></div>
      </section>

      <section class="max-w-[1400px] mx-auto px-[60px] py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-[#1c0845] mb-4 font-jakarta">
            Accès <span class="text-[#7c3aed]">rapide</span>
          </h2>
          <p class="text-[#5f527a] text-lg font-jakarta">Choisissez votre espace pour commencer</p>
        </div>

        <div class="relative max-w-5xl mx-auto mb-20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div class="bg-white rounded-[32px] border border-[#e4e0eb] shadow-xl p-10 hover:border-[#7c3aed] transition-all group">
              <div class="w-16 h-16 bg-[#4e79f3] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#1c0845] mb-4 font-jakarta">Espace Étudiant</h3>
              <p class="text-[#5f527a] mb-8 font-jakarta leading-relaxed">Accédez à vos évaluations et donnez votre avis sur les enseignements suivis.</p>
              <button @click="handleNavigation('/login')" class="w-full h-12 bg-[#7c3aed] hover:bg-[#6b2acd] text-white font-bold rounded-xl shadow-lg shadow-purple-100 transition-all active:scale-95">Accéder</button>
            </div>

            <div class="bg-white rounded-[32px] border border-[#e4e0eb] shadow-xl p-10 hover:border-[#7c3aed] transition-all group">
              <div class="w-16 h-16 bg-[#ed5b9e] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-100 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#1c0845] mb-4 font-jakarta">Espace Enseignant</h3>
              <p class="text-[#5f527a] mb-8 font-jakarta leading-relaxed">Consultez les statistiques anonymisées et les retours pédagogiques de vos cours.</p>
              <button class="w-full h-12 bg-[#7c3aed] hover:bg-[#6b2acd] text-white font-bold rounded-xl shadow-lg shadow-purple-100 transition-all active:scale-95">Accéder</button>
            </div>
          </div>
          
          <div class="hidden xl:block absolute -right-32 bottom-[-20px] w-[280px]">
  <img src="/1.png" alt="Illustration" class="w-full h-auto drop-shadow-2xl" />
</div>
        </div>
      </section>

      <section class="bg-white py-24 border-t border-gray-50">
        <div class="max-w-[1400px] mx-auto px-[60px]">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div v-for="(step, i) in steps" :key="i" class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-[#6b46c1] to-[#7c3aed] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
                <span class="text-3xl font-black text-white font-jakarta -rotate-3">{{ i + 1 }}</span>
              </div>
              <h3 class="text-xl font-bold text-[#1c0845] mb-4 font-jakarta">{{ step.title }}</h3>
              <p class="text-[#5f527a] font-jakarta">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-[#f8f7fa] border-t border-[#e4e0eb] py-12">
      <div class="max-w-[1400px] mx-auto px-[60px]">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <img src="/isis-2.png" alt="ISIS" class="h-8 w-auto grayscale opacity-70 hover:grayscale-0 transition-all" />
            <img src="/PartINSA-GrisRouge 1.png" alt="INSA" class="h-8 w-auto grayscale opacity-70 hover:grayscale-0 transition-all" />
            <img src="/image 1.png" alt="UC" class="h-8 w-auto grayscale opacity-70 hover:grayscale-0 transition-all" />
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-[#5f527a] font-jakarta font-medium mb-1">© 2026 École d'ingénieurs ISIS - Projet FIE-3</p>
            <p class="text-xs text-[#5f527a]/60 font-jakarta uppercase tracking-widest font-bold italic">Plateforme d'amélioration continue</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigationItems = [
  { label: "Accueil", active: true, route: "/" },
  { label: "Connexion", active: false, route: "/login" },
];

const steps = [
  { title: "Connexion", desc: "Authentifiez-vous avec vos identifiants institutionnels ISIS via l'ENT." },
  { title: "Évaluation", desc: "Remplissez les questionnaires pour vos différents modules de cours." },
  { title: "Anonymat", desc: "Vos réponses sont traitées de manière 100% anonyme pour les statistiques." }
];

const handleNavigation = (route) => {
  router.push(route);
};
</script>

<style scoped>
/* Utilisation de la police sans les tirets bas si elle est chargée via Google Fonts */
.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>