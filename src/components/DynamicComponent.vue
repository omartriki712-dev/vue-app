<script setup>
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: String
})

const IconComponent = icons[props.name]
</script>

<template>
  <component :is="IconComponent" v-if="IconComponent" />
</template>
