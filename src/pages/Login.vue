<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="card shadow">
          <div class="card-body">

            <h2 class="text-center mb-4">Login to TaskMate</h2>

            <form @submit.prevent="loginUser">

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <!-- Error message -->
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <!-- Login Button -->
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  Login
                </button>
              </div>

            </form>

            <div class="text-center mt-3">
              <p>
                Don’t have an account?
                <router-link to="/register">Register here</router-link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: ""
    }
  },
  methods: {
    loginUser() {
      // Placeholder login logic (no backend yet)
      if (this.email === "" || this.password === "") {
        this.errorMessage = "Please fill in all fields."
        return
      }

      // Very basic demo validation
      if (this.email === "test@taskmate.com" && this.password === "1234") {
        this.errorMessage = ""
        alert("Login successful!")
        this.$router.push("/projects")
      } else {
        this.errorMessage = "Invalid email or password."
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}

h2 {
  font-weight: bold;
}
</style>
