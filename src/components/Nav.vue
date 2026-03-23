<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "../api/firebase"

const router = useRouter()

const currentUser = ref(null)
const avatarUrl = ref("")
const displayName = ref("")
const showDropdown = ref(false)

let unsubscribeAuth = null
let unsubscribeUserDoc = null

const initials = computed(() => {
  const name = displayName.value.trim()

  if (!name) {
    const email = currentUser.value?.email || ""
    return email ? email.charAt(0).toUpperCase() : "T"
  }

  const parts = name.split(" ").filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[1][0]).toUpperCase()
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const goHome = () => {
  closeDropdown()
  router.push("/")
}

const goProjects = () => {
  closeDropdown()
  router.push("/projects")
}

const goSettings = () => {
  closeDropdown()
  router.push("/settings")
}

const goFriends = () => {
  closeDropdown()
  router.push("/friends")
}

const logout = async () => {
  closeDropdown()
  await signOut(auth)
  router.push("/")
}

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    avatarUrl.value = ""
    displayName.value = user?.displayName || ""

    if (unsubscribeUserDoc) {
      unsubscribeUserDoc()
      unsubscribeUserDoc = null
    }

    if (user) {
      const userRef = doc(db, "users", user.uid)

      unsubscribeUserDoc = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          avatarUrl.value = data.avatarUrl || ""
          displayName.value =
            data.displayName || user.displayName || user.email || "TaskMate User"
        } else {
          avatarUrl.value = ""
          displayName.value = user.displayName || user.email || "TaskMate User"
        }
      })
    }
  })

  document.addEventListener("click", closeDropdown)
})

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
  if (unsubscribeUserDoc) unsubscribeUserDoc()
  document.removeEventListener("click", closeDropdown)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <div class="nav-avatar-wrapper" @click.stop="goHome">
          <img
            v-if="currentUser && avatarUrl"
            :src="avatarUrl"
            alt="avatar"
            class="nav-avatar"
          />

          <div
            v-else-if="currentUser"
            class="nav-avatar-fallback"
          >
            {{ initials }}
          </div>

          <img
            v-else
            src="/taskmate-logo.png"
            alt="logo"
            class="nav-logo"
          />
        </div>

        <div class="d-flex flex-column">
          <span class="fw-bold nav-title">TaskMate</span>
          <small v-if="currentUser" class="text-muted nav-display-name">
            {{ displayName }}
          </small>
        </div>
      </div>

      <div v-if="currentUser" class="position-relative d-flex gap-2">
        <button
          class="btn btn-primary btn-sm"
          @click.stop="goHome"
        >
          Home
        </button>

        <button
          class="btn btn-outline-secondary btn-sm"
          @click.stop="toggleDropdown"
        >
          Menu
        </button>

        <div v-if="showDropdown" class="dropdown-menu-custom" @click.stop>
          <button @click="goProjects">My Projects</button>
          <button @click="goFriends">Friends</button>
          <button @click="goSettings">Settings</button>
          <hr />
          <button @click="logout" class="text-danger">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-avatar-wrapper {
  cursor: pointer;
}

.nav-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dee2e6;
}

.nav-avatar-fallback {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0d6efd;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid #dee2e6;
}

.nav-logo {
  width: 44px;
  height: 44px;
}

.nav-title {
  line-height: 1.1;
}

.nav-display-name {
  line-height: 1.1;
}

.dropdown-menu-custom {
  position: absolute;
  right: 0;
  top: 42px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.5rem;
  width: 160px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 1200;
}

.dropdown-menu-custom button {
  width: 100%;
  border: none;
  background: none;
  padding: 0.5rem;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu-custom button:hover {
  background: #f1f1f1;
}
</style>