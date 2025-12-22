import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Pastikan file router ada di folder src/router/index.js

const app = createApp(App)

app.use(router) // PENTING: Mengaktifkan navigasi halaman
app.mount('#app')