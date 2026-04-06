<template>
  <div 
    class="stat-card"
    :class="`stat-card--${variant}`"
  >
    <div class="stat-card__content">
      <div class="stat-card__header">
        <span class="stat-card__title">
          {{ title }}
        </span>
        
        <div class="stat-card__icon">
          <component :is="icon" class="h-5 w-5" />
        </div>
      </div>

      <div class="stat-card__value">
        {{ value }}
      </div>
      
      <p class="stat-card__subtext">
        {{ subtext }}
      </p>

      <div v-if="trendValue" class="stat-card__trend">
        <TrendingUp v-if="!isTrendDown" class="h-3 w-3" />
        <TrendingDown v-else class="h-3 w-3" />
        
        <span>
          {{ trendValue }} 
          <span class="stat-card__trend-label">
            {{ trendLabel }}
          </span>
        </span>
      </div>
    </div>

    <div v-if="variant === 'primary'" class="stat-card__decoration"></div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown } from "lucide-vue-next";

defineProps({
  title: String,
  value: [String, Number],
  subtext: String,
  icon: Object, // Composant Lucide
  variant: {
    type: String,
    default: 'white' // 'primary', 'white', 'danger'
  },
  trendValue: String,
  trendLabel: String,
  isTrendDown: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.stat-card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card--primary {
  background-color: #2f0d73;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.1);
}

.stat-card--white {
  background-color: white;
  border: 1px solid rgba(228, 224, 235, 0.4);
}

.stat-card--danger {
  background-color: #fff5f5;
  border: 1px solid #fee2e2;
}

.stat-card__content {
  position: relative;
  z-index: 10;
}

.stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-card__title {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-card--primary .stat-card__title {
  opacity: 0.8;
}

.stat-card--white .stat-card__title,
.stat-card--danger .stat-card__title {
  color: #5f527a;
}

.stat-card__icon {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.stat-card--primary .stat-card__icon {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.stat-card--white .stat-card__icon {
  background-color: #f8f7fa;
  color: #2f0d73;
}

.stat-card--danger .stat-card__icon {
  background-color: white;
  color: #f87171;
}

.stat-card__value {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-card--white .stat-card__value,
.stat-card--danger .stat-card__value {
  color: #1c0845;
}

.stat-card__subtext {
  font-size: 0.625rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.stat-card--primary .stat-card__subtext {
  opacity: 0.7;
}

.stat-card--white .stat-card__subtext,
.stat-card--danger .stat-card__subtext {
  color: #5f527a;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.stat-card--primary .stat-card__trend {
  color: #86efac;
}

.stat-card--white .stat-card__trend {
  color: #10b981;
}

.stat-card--danger .stat-card__trend {
  color: #ef4444;
}

.stat-card__trend-label {
  font-weight: normal;
}

.stat-card--primary .stat-card__trend-label {
  opacity: 0.7;
  color: white;
}

.stat-card--white .stat-card__trend-label,
.stat-card--danger .stat-card__trend-label {
  color: #5f527a;
}

.stat-card__decoration {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  width: 6rem;
  height: 6rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.stat-card--primary:hover .stat-card__decoration {
  transform: scale(1.25);
}
</style>