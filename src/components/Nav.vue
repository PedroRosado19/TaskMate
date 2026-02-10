<template>
  <nav class="navbar nav-bg">
    <div class="container-fluid d-flex justify-content-between align-items-center">

      <!-- Left buttons -->
      <div class="d-flex flex-column align-items-start">
        <router-link to="/" class="btn nav-btn mb-2">
          Home
        </router-link>
        <router-link to="/settings" class="btn nav-btn">
          Settings
        </router-link>
      </div>

      <!-- Center Logo (background already, this just keeps space balanced) -->
      <div class="logo-spacer"></div>

      <!-- Right buttons -->
      <div class="d-flex flex-column align-items-end">
        <router-link to="/register" class="btn nav-btn mb-2">
          Register
        </router-link>
        <router-link to="/login" class="btn nav-btn">
          Login
        </router-link>
      </div>

    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav"
}
</script>

<style scoped>
/* Navbar container */
.navbar {
  padding: 20px 40px;
  min-height: 170px;
}

/* Logo as navbar background */
.nav-bg {
  background-image: url("@/assets/taskmate-logo.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 520px auto;
  background-color: white;
}

/* Invisible spacer so logo stays centered */
.logo-spacer {
  flex: 1;
}

/* Unified button style for all nav buttons */
.nav-btn {
  background-color: #2e8b57;
  color: white;
  width: 140px;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
  border: none;
  transition: 0.2s ease;
}

.nav-btn:hover {
  background-color: #256b45;
  color: white;
}
</style>
