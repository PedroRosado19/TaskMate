<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import {
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  signOut
} from "firebase/auth"
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "../api/firebase"

const router = useRouter()

const currentUser = ref(null)

const displayName = ref("")
const avatarUrl = ref("")
const theme = ref("light")
const defaultVisibility = ref("private")
const selectedFile = ref(null)

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false)

const successMessage = ref("")
const errorMessage = ref("")

const MAX_AVATAR_SIZE = 2 * 1024 * 1024

let unsubscribeAuth = null

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

const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", theme.value)
  document.body.setAttribute("data-theme", theme.value)
}

const loadUserSettings = async (user) => {
  try {
    displayName.value = user.displayName || ""

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      displayName.value = data.displayName || user.displayName || ""
      avatarUrl.value = data.avatarUrl || ""
      theme.value = data.theme || "light"
      defaultVisibility.value = data.defaultVisibility || "private"
    } else {
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email?.toLowerCase() || "",
          displayName: user.displayName || "",
          avatarUrl: "",
          theme: "light",
          defaultVisibility: "private",
          friends: [],
          createdAt: serverTimestamp()
        },
        { merge: true }
      )
    }

    applyTheme()
  } catch (error) {
    console.error("Error loading settings:", error)
    errorMessage.value = "Failed to load settings."
  } finally {
    loading.value = false
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0] || null
  selectedFile.value = file
  errorMessage.value = ""
  successMessage.value = ""

  if (file && file.size > MAX_AVATAR_SIZE) {
    errorMessage.value = "Avatar must be 2MB or smaller."
    selectedFile.value = null
  }
}

const uploadAvatar = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!selectedFile.value) {
    errorMessage.value = "Please choose an image first."
    return
  }

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  if (!selectedFile.value.type.startsWith("image/")) {
    errorMessage.value = "Please select an image file."
    return
  }

  if (selectedFile.value.size > MAX_AVATAR_SIZE) {
    errorMessage.value = "Avatar must be 2MB or smaller."
    return
  }

  uploading.value = true

  try {
    const filePath = `avatars/${currentUser.value.uid}`
    const fileRef = storageRef(storage, filePath)

    await uploadBytes(fileRef, selectedFile.value)
    const url = await getDownloadURL(fileRef)

    avatarUrl.value = url

    await setDoc(
      doc(db, "users", currentUser.value.uid),
      {
        uid: currentUser.value.uid,
        email: currentUser.value.email?.toLowerCase() || "",
        displayName: displayName.value.trim(),
        avatarUrl: url,
        theme: theme.value,
        defaultVisibility: defaultVisibility.value,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    selectedFile.value = null
    successMessage.value = "Avatar uploaded successfully."
  } catch (error) {
    console.error("Avatar upload error:", error)
    errorMessage.value = "Avatar upload failed."
  } finally {
    uploading.value = false
  }
}

const removeAvatar = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  try {
    avatarUrl.value = ""

    await setDoc(
      doc(db, "users", currentUser.value.uid),
      {
        uid: currentUser.value.uid,
        email: currentUser.value.email?.toLowerCase() || "",
        displayName: displayName.value.trim(),
        avatarUrl: "",
        theme: theme.value,
        defaultVisibility: defaultVisibility.value,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    successMessage.value = "Avatar removed successfully."
  } catch (error) {
    console.error("Remove avatar error:", error)
    errorMessage.value = "Failed to remove avatar."
  }
}

const saveSettings = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  saving.value = true

  try {
    await updateProfile(currentUser.value, {
      displayName: displayName.value.trim()
    })

    await setDoc(
      doc(db, "users", currentUser.value.uid),
      {
        uid: currentUser.value.uid,
        email: currentUser.value.email?.toLowerCase() || "",
        displayName: displayName.value.trim(),
        avatarUrl: avatarUrl.value.trim(),
        theme: theme.value,
        defaultVisibility: defaultVisibility.value,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    applyTheme()
    successMessage.value = "Settings saved successfully."
  } catch (error) {
    console.error("Error saving settings:", error)
    errorMessage.value = "Failed to save settings."
  } finally {
    saving.value = false
  }
}

const logout = async () => {
  try {
    await signOut(auth)
    router.push("/")
  } catch (error) {
    console.error("Logout error:", error)
    errorMessage.value = "Failed to log out."
  }
}

const removeAccount = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  const confirmed = window.confirm(
    "Are you sure you want to remove your account? This action cannot be undone."
  )

  if (!confirmed) {
    return
  }

  deleting.value = true

  try {
    await deleteUser(currentUser.value)
    router.push("/")
  } catch (error) {
    console.error("Error deleting account:", error)
    errorMessage.value =
      "Failed to remove account. Please log in again and try once more."
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    currentUser.value = user

    if (!user) {
      loading.value = false
      router.push("/login")
      return
    }

    await loadUserSettings(user)
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})
</script>

<template>
  <section class="taskmate-page container">
    <div class="taskmate-card-md">
      <div class="card yellow-sticker-card p-4 p-md-5">
        <div class="mb-4">
          <h2 class="fw-bold mb-1">Settings</h2>
          <p class="text-muted mb-0">Manage your TaskMate account</p>
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="text-center py-4 text-muted">
          Loading settings...
        </div>

        <div v-else>
          <div class="card settings-card p-3 mb-3">
            <h5 class="fw-bold mb-3">Change Name</h5>
            <label for="displayName" class="form-label">Display Name</label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              class="form-control"
              placeholder="Enter your name"
            />
          </div>

          <div class="card settings-card p-3 mb-3">
            <h5 class="fw-bold mb-3">Change Avatar</h5>

            <div class="avatar-preview-wrapper mb-3">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Avatar preview"
                class="avatar-preview"
              />

              <div v-else class="avatar-initials-preview">
                {{ initials }}
              </div>

              <div v-if="uploading" class="avatar-overlay">
                <div class="spinner-border text-light" role="status"></div>
              </div>
            </div>

            <label for="avatarUpload" class="form-label">Upload Avatar Image</label>
            <input
              id="avatarUpload"
              type="file"
              class="form-control"
              accept="image/*"
              @change="handleFileChange"
            />

            <small class="text-muted d-block mt-2">
              Maximum avatar size: 2MB
            </small>

            <div class="d-flex gap-2 mt-3 flex-wrap">
              <button
                class="btn btn-primary"
                @click="uploadAvatar"
                :disabled="uploading"
              >
                {{ uploading ? "Uploading..." : "Upload Avatar" }}
              </button>

              <button
                class="btn btn-outline-danger"
                @click="removeAvatar"
                :disabled="uploading"
              >
                Remove Avatar
              </button>
            </div>
          </div>

          <div class="card settings-card p-3 mb-3">
            <h5 class="fw-bold mb-3">Visibility</h5>
            <label for="defaultVisibility" class="form-label">
              Default Project Visibility
            </label>
            <select
              id="defaultVisibility"
              v-model="defaultVisibility"
              class="form-select"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div class="card settings-card p-3 mb-4">
            <h5 class="fw-bold mb-3">Light / Dark Mode</h5>
            <label for="theme" class="form-label">Theme</label>
            <select
              id="theme"
              v-model="theme"
              class="form-select"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <div class="d-flex gap-3 flex-wrap">
            <button
              class="btn btn-success flex-fill"
              @click="saveSettings"
              :disabled="saving"
            >
              {{ saving ? "Saving..." : "Save Settings" }}
            </button>

            <button
              class="btn btn-outline-secondary flex-fill"
              @click="logout"
            >
              Logout
            </button>

            <button
              class="btn btn-danger flex-fill"
              @click="removeAccount"
              :disabled="deleting"
            >
              {{ deleting ? "Removing..." : "Remove Account" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.settings-card {
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: none;
}

.avatar-preview-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto;
}

.avatar-preview {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dee2e6;
}

.avatar-initials-preview {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #0d6efd;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  border: 2px solid #dee2e6;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>