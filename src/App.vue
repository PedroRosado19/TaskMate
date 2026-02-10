<template>
  <div>
    <!-- Navigation bar shown on all pages -->
    <Nav />

    <!-- Main content rendered by Vue Router -->
    <div class="container-fluid mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>

<style>
/* Global styling for TaskMate */

body {
  background-color: #f8f9fa;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4 {
  font-weight: bold;
}

.container-fluid {
  padding-bottom: 40px;
}
</style>
