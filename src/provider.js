import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// define global provider
app.provide('apiUrl', 'https://api.example.com')

app.mount('#app');
