<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="card shadow">
          <div class="card-body">

            <h2 class="text-center mb-4">Create a TaskMate Account</h2>

            <form @submit.prevent="registerUser">

              <!-- Full Name -->
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="fullName"
                  required
                  placeholder="Enter your full name"
                />
              </div>

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

              <!-- Confirm Password -->
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="confirmPassword"
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <!-- Error / Success Messages -->
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <!-- Register Button -->
              <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg">
                  Register
                </button>
              </div>

            </form>

            <div class="text-center mt-3">
              <p>
                Already have an account?
                <router-link to="/login">Login here</router-link>
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
  name: "Register",
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      successMessage: ""
    }
  },
  methods: {
    registerUser() {
      // Clear previous messages
      this.errorMessage = ""
      this.successMessage = ""

      // Basic validation
      if (
        this.fullName === "" ||
        this.email === "" ||
        this.password === "" ||
        this.confirmPassword === ""
      ) {
        this.errorMessage = "All fields are required."
        return
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match."
        return
      }

      if (this.password.length < 4) {
        this.errorMessage = "Password must be at least 4 characters long."
        return
      }

      // Demo success (no backend yet)
      this.successMessage = "Registration successful! You can now log in."

      // Clear form
      this.fullName = ""
      this.email = ""
      this.password = ""
      this.confirmPassword = ""

      // Redirect to login after short delay
      setTimeout(() => {
        this.$router.push("/login")
      }, 1500)
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
