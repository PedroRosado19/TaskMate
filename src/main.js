import { createApp } from 'vue'
import App from './App.vue'

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router/routes'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// Create the Vue application
const app = createApp(App)

// Use router inside Vue
app.use(router)

// Mount the app to index.html
app.mount('#app')
