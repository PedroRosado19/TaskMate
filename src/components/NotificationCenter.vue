<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { onAuthStateChanged } from "firebase/auth"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { auth, db } from "../api/firebase"

const router = useRouter()
const currentUser = ref(null)
const notifications = ref([])

let unsubscribeAuth = null
let unsubscribeProjects = null

const getToday = () => new Date().toISOString().split("T")[0]

const getTomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

const buildNotifications = (projects) => {
  const today = getToday()
  const tomorrow = getTomorrow()
  const list = []

  projects.forEach((p) => {
    if (!p.dueDate) return

    if (p.dueDate === tomorrow) {
      list.push({
        id: p.id,
        message: `${p.name} is due tomorrow`,
        type: "warning"
      })
    }

    if (p.dueDate === today) {
      list.push({
        id: p.id + "-today",
        message: `${p.name} is due today`,
        type: "danger"
      })
    }
  })

  notifications.value = list
}

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user

    if (!user) return

    const q = query(
      collection(db, "projects"),
      where("members", "array-contains", user.uid)
    )

    unsubscribeProjects = onSnapshot(q, (snap) => {
      const projects = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))

      buildNotifications(projects)
    })
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
  if (unsubscribeProjects) unsubscribeProjects()
})
</script>

<template>
  <div v-if="notifications.length" class="notif-container">
    <div
      v-for="n in notifications"
      :key="n.id"
      class="notif"
      :class="n.type"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<style scoped>
.notif-container {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notif {
  padding: 12px 16px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
}

.warning {
  background: orange;
}

.danger {
  background: red;
}
</style>