<template>
  <div class="home-wrapper">

    <div class="buttons-container">
      <!-- Sticky Note Button -->
      <router-link to="/projects" class="sticky-note">
        Create / View Projects
      </router-link>

      <!-- Normal button -->
      <router-link to="/about" class="btn about-btn">
        About TaskMate
      </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
.home-wrapper {
  height: calc(100vh - 170px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons-container {
  width: 100%;
  max-width: 500px;
  display: grid;
  gap: 25px;
}

/* Sticky note – 4x taller */
.sticky-note {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffeb3b;
  color: #333;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 80px 20px;   /* makes it much taller */
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 6px 10px 18px rgba(0, 0, 0, 0.25);
  transform: rotate(-1deg);
  transition: 0.2s ease;
  position: relative;
  text-align: center;
}

/* Sticky tape look */
.sticky-note::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  width: 70px;
  height: 14px;
  background: rgba(255, 255, 255, 0.7);
  transform: translateX(-50%);
  border-radius: 4px;
}

.sticky-note:hover {
  transform: rotate(0deg) scale(1.03);
  box-shadow: 8px 14px 22px rgba(0, 0, 0, 0.35);
}

/* About button */
.about-btn {
  background-color: #6c757d;
  color: white;
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 10px;
}
</style>
