<template>
  <div class="container mt-4">

    <h2 class="text-center mb-4">User Settings</h2>

    <div class="card shadow">
      <div class="card-body">

        <form @submit.prevent="updateProfile">

          <!-- Full Name -->
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input
              type="text"
              class="form-control"
              v-model="fullName"
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              class="form-control"
              v-model="email"
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
            />
          </div>

          <!-- Theme (simple demo setting) -->
          <div class="mb-3">
            <label class="form-label">Theme</label>
            <select class="form-select" v-model="theme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <!-- Messages -->
          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <!-- Save Button -->
          <div class="d-grid">
            <button class="btn btn-primary btn-lg">
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      fullName: "Demo User",
      email: "test@taskmate.com",
      password: "",
      theme: "light",
      successMessage: ""
    }
  },
  methods: {
    updateProfile() {
      this.successMessage = "Profile updated successfully!"
      this.password = ""
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
