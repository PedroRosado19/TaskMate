<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "../api/firebase"

const router = useRouter()

const firstName = ref("")
const surname = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const errorMessage = ref("")
const loading = ref(false)

const register = async () => {
  errorMessage.value = ""
  loading.value = true

  const cleanFirstName = firstName.value.trim()
  const cleanSurname = surname.value.trim()
  const cleanEmail = email.value.trim().toLowerCase()

  if (!cleanFirstName) {
    errorMessage.value = "First name is required."
    loading.value = false
    return
  }

  if (!cleanSurname) {
    errorMessage.value = "Surname is required."
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match."
    loading.value = false
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password.value
    )

    const user = userCredential.user
    const fullName = `${cleanFirstName} ${cleanSurname}`

    await updateProfile(user, {
      displayName: fullName
    })

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email?.toLowerCase() || cleanEmail,
      firstName: cleanFirstName,
      surname: cleanSurname,
      displayName: fullName,
      avatarUrl: "",
      theme: "light",
      defaultVisibility: "private",
      friends: [],
      createdAt: serverTimestamp()
    })

    router.push("/")
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage.value = "That email is already in use."
        break
      case "auth/invalid-email":
        errorMessage.value = "Please enter a valid email address."
        break
      case "auth/weak-password":
        errorMessage.value = "Password should be at least 6 characters."
        break
      default:
        errorMessage.value = "Registration failed. Please try again."
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="taskmate-page container">
    <div class="taskmate-card-sm">
      <div class="card yellow-sticker-card p-4 p-md-5">
        <h1 class="text-center fw-bold mb-4">Register</h1>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="registerFirstName" class="form-label">First Name</label>
            <input
              id="registerFirstName"
              v-model="firstName"
              type="text"
              class="form-control"
              placeholder="Enter your first name"
              autocomplete="given-name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerSurname" class="form-label">Surname</label>
            <input
              id="registerSurname"
              v-model="surname"
              type="text"
              class="form-control"
              placeholder="Enter your surname"
              autocomplete="family-name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerEmail" class="form-label">Email address</label>
            <input
              id="registerEmail"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Enter your email"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerPassword" class="form-label">Password</label>
            <input
              id="registerPassword"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Create a password"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
            <input
              id="registerConfirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-control"
              placeholder="Confirm your password"
              autocomplete="new-password"
              required
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-success w-100" :disabled="loading">
            {{ loading ? "Creating account..." : "Create Account" }}
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </section>
</template>