<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { onAuthStateChanged } from "firebase/auth"
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore"
import { auth, db } from "../api/firebase"

const currentUser = ref(null)
const friendEmail = ref("")
const requests = ref([])
const friends = ref([])
const successMessage = ref("")
const errorMessage = ref("")
const loading = ref(true)

let unsubscribeAuth = null
let unsubscribeRequests = null

const loadFriends = async (friendIds) => {
  friends.value = []

  if (!friendIds || friendIds.length === 0) {
    return
  }

  try {
    const loadedFriends = await Promise.all(
      friendIds.map(async (uid) => {
        const snap = await getDoc(doc(db, "users", uid))
        return snap.exists() ? snap.data() : null
      })
    )

    friends.value = loadedFriends.filter(Boolean)
  } catch (error) {
    console.error("Error loading friends:", error)
  }
}

const loadRequests = (uid) => {
  if (unsubscribeRequests) {
    unsubscribeRequests()
    unsubscribeRequests = null
  }

  const q = query(collection(db, "friendRequests"), where("toUid", "==", uid))

  unsubscribeRequests = onSnapshot(q, (snapshot) => {
    requests.value = snapshot.docs
      .map((requestDoc) => ({
        id: requestDoc.id,
        ...requestDoc.data()
      }))
      .filter((request) => request.status === "pending")
  })
}

const sendFriendRequest = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  const cleanEmail = friendEmail.value.trim().toLowerCase()

  if (!cleanEmail) {
    errorMessage.value = "Enter a TaskMate account email."
    return
  }

  if (!cleanEmail.includes("@")) {
    errorMessage.value = "Enter a valid email address."
    return
  }

  if (cleanEmail === (currentUser.value.email || "").toLowerCase()) {
    errorMessage.value = "You cannot add yourself."
    return
  }

  try {
    const usersRef = collection(db, "users")
    const usersQuery = query(usersRef, where("email", "==", cleanEmail))
    const userSnapshot = await getDocs(usersQuery)

    if (userSnapshot.empty) {
      errorMessage.value = "No TaskMate account found for this email."
      return
    }

    const foundUser = userSnapshot.docs[0].data()

    if ((friends.value || []).some((friend) => friend.uid === foundUser.uid)) {
      errorMessage.value = "This user is already your friend."
      return
    }

    const requestId = `${currentUser.value.uid}_${foundUser.uid}`
    const reverseRequestId = `${foundUser.uid}_${currentUser.value.uid}`

    const existingRequest = await getDoc(doc(db, "friendRequests", requestId))
    const reverseRequest = await getDoc(doc(db, "friendRequests", reverseRequestId))

    if (existingRequest.exists() && existingRequest.data().status === "pending") {
      errorMessage.value = "Friend request already sent."
      return
    }

    if (reverseRequest.exists() && reverseRequest.data().status === "pending") {
      errorMessage.value = "This user already sent you a friend request."
      return
    }

    await setDoc(doc(db, "friendRequests", requestId), {
      fromUid: currentUser.value.uid,
      fromEmail: currentUser.value.email?.toLowerCase() || "",
      fromName:
        currentUser.value.displayName ||
        currentUser.value.email ||
        "TaskMate User",
      toUid: foundUser.uid,
      toEmail: foundUser.email?.toLowerCase() || cleanEmail,
      status: "pending",
      createdAt: serverTimestamp()
    })

    friendEmail.value = ""
    successMessage.value = "Friend request sent successfully."
  } catch (error) {
    console.error("Error sending friend request:", error)
    errorMessage.value = "Failed to send friend request."
  }
}

const acceptRequest = async (request) => {
  successMessage.value = ""
  errorMessage.value = ""

  if (!currentUser.value) {
    errorMessage.value = "You must be logged in."
    return
  }

  try {
    await updateDoc(doc(db, "users", currentUser.value.uid), {
      friends: arrayUnion(request.fromUid)
    })

    await updateDoc(doc(db, "users", request.fromUid), {
      friends: arrayUnion(currentUser.value.uid)
    })

    await updateDoc(doc(db, "friendRequests", request.id), {
      status: "accepted",
      respondedAt: serverTimestamp()
    })

    const currentUserSnap = await getDoc(doc(db, "users", currentUser.value.uid))
    if (currentUserSnap.exists()) {
      await loadFriends(currentUserSnap.data().friends || [])
    }

    successMessage.value = "Friend request accepted."
  } catch (error) {
    console.error("Error accepting friend request:", error)
    errorMessage.value = "Failed to accept friend request."
  }
}

const declineRequest = async (request) => {
  successMessage.value = ""
  errorMessage.value = ""

  try {
    await updateDoc(doc(db, "friendRequests", request.id), {
      status: "declined",
      respondedAt: serverTimestamp()
    })

    successMessage.value = "Friend request declined."
  } catch (error) {
    console.error("Error declining friend request:", error)
    errorMessage.value = "Failed to decline friend request."
  }
}

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    currentUser.value = user

    if (!user) {
      loading.value = false
      return
    }

    const userSnap = await getDoc(doc(db, "users", user.uid))

    if (userSnap.exists()) {
      await loadFriends(userSnap.data().friends || [])
    }

    loadRequests(user.uid)
    loading.value = false
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
  if (unsubscribeRequests) unsubscribeRequests()
})
</script>

<template>
  <section class="taskmate-page container">
    <div class="taskmate-card-md">
      <div class="card yellow-sticker-card p-4 p-md-5">
        <div class="mb-4">
          <h2 class="fw-bold mb-1">Friends</h2>
          <p class="text-muted mb-0">Add friends and manage friend requests</p>
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="text-center py-4 text-muted">
          Loading friends...
        </div>

        <div v-else>
          <div class="card friends-card p-3 mb-4">
            <h5 class="fw-bold mb-3">Add Friend</h5>

            <label for="friendEmail" class="form-label">TaskMate Account Email</label>
            <input
              id="friendEmail"
              v-model="friendEmail"
              type="email"
              class="form-control"
              placeholder="Enter friend email"
            />

            <button class="btn btn-success mt-3" @click="sendFriendRequest">
              Send Friend Request
            </button>
          </div>

          <div class="card friends-card p-3 mb-4">
            <h5 class="fw-bold mb-3">Friend Requests</h5>

            <div v-if="requests.length === 0" class="text-muted">
              No pending friend requests.
            </div>

            <div v-else class="d-grid gap-3">
              <div
                v-for="request in requests"
                :key="request.id"
                class="request-card"
              >
                <div class="fw-semibold">
                  {{ request.fromName || request.fromEmail }}
                </div>

                <small class="text-muted d-block mb-3">
                  {{ request.fromEmail }}
                </small>

                <div class="d-flex gap-2">
                  <button
                    class="btn btn-success btn-sm flex-fill"
                    @click="acceptRequest(request)"
                  >
                    Accept
                  </button>

                  <button
                    class="btn btn-outline-danger btn-sm flex-fill"
                    @click="declineRequest(request)"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card friends-card p-3">
            <h5 class="fw-bold mb-3">My Friends</h5>

            <div v-if="friends.length === 0" class="text-muted">
              No friends added yet.
            </div>

            <ul v-else class="friend-list">
              <li
                v-for="friend in friends"
                :key="friend.uid"
                class="friend-row"
              >
                <div class="d-flex align-items-center gap-2">
                  <img
                    v-if="friend.avatarUrl"
                    :src="friend.avatarUrl"
                    alt="Friend avatar"
                    class="friend-avatar"
                  />

                  <div v-else class="friend-avatar-fallback">
                    {{ (friend.displayName || friend.email || "T").charAt(0).toUpperCase() }}
                  </div>

                  <div>
                    <div class="fw-semibold">
                      {{ friend.displayName || "TaskMate User" }}
                    </div>
                    <small class="text-muted">{{ friend.email }}</small>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.friends-card {
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: none;
}

.request-card {
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 0.9rem;
}

.friend-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.friend-row {
  padding: 0.6rem 0;
  border-bottom: 1px solid #e9ecef;
}

.friend-row:last-child {
  border-bottom: none;
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-avatar-fallback {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0d6efd;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
</style>