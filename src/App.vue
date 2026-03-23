<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./api/firebase"

import Nav from "./components/Nav.vue"
import GlobalChat from "./components/GlobalChat.vue"

const currentUser = ref(null)

let unsubscribeAuth = null

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})
</script>

<template>
  <Nav />
  <router-view />
  <GlobalChat v-if="currentUser" />
</template>