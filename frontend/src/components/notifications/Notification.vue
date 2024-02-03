<script setup>
import { firestoreDB } from "@/config.js";
import { collection, onSnapshot, doc } from "firebase/firestore";
import userStore from "@/context/loggedUser.js";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { API_URL } from "@/config.js";

const { userId, token } = userStore();
const notifications = ref([]);
const userDoc = doc(firestoreDB, "Users", userId.value);
const notificationCollection = collection(userDoc, "Notifications");
onSnapshot(notificationCollection, (snapshot) => {
  const userNotifications = snapshot.docs
    .map((notification) => ({
      id: notification.id,
      ...notification.data(),
    }))
    .sort((n1, n2) => n2.date - n1.date);
  notifications.value = userNotifications;
});

const clickHandler = async (notificationId, type) => {
  try {
    let url = `${API_URL}/notifications`;
    const response = await fetch(url, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify({
        notificationId,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

<template>
  <v-row class="ma-2">
    <v-col
      cols="12"
      xs="12"
      md="6"
      lg="4"
      v-for="notification in notifications"
    >
      <div class="notification-box pa-5">
        <div
          v-if="notification.type === 'comment'"
          class="text-subtitle-1 text font-weight-bold"
        >
          new comment
        </div>
        <div class="text-end text-body-2 text-medium-emphasis">
          {{
            new Date(notification.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          }}
        </div>
        <div class="text-justify text-body-2 font-italic my-3">
          {{ notification.text }}
        </div>
        <div class="d-flex justify-end ga-2">
          <v-btn
            icon=""
            variant="tonal"
            color="primary"
            size="small"
            density="comfortable"
            :disabled="notification.read"
            @click="clickHandler(notification.id, 'PATCH')"
          >
            <v-icon size="small">{{
              notification.read ? "mdi-email-open" : "mdi-email"
            }}</v-icon>
          </v-btn>
          <v-btn
            icon=""
            variant="tonal"
            color="red"
            size="small"
            density="comfortable"
            @click="clickHandler(notification.id, 'DELETE')"
            ><v-icon size="small">mdi-delete</v-icon></v-btn
          >
        </div>
      </div>
    </v-col>
  </v-row>
  <div
    v-if="notifications.length"
    class="text-caption text-medium-emphasis font-italic text-center my-8 mb-16"
  >
    No more notifications
  </div>
  <div
    v-else="!notifications.length"
    class="text-center mt-5 text-medium-emphasis font-italic text-body-1"
  >
    It seems empty
  </div>
</template>

<style>
.notification-box {
  background-color: rgb(var(--v-theme-ternary));
  border-radius: 0.5rem;
}
</style>
