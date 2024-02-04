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
  <v-data-iterator :items="notifications" :items-per-page="9">
    <template v-slot:default="{ items }">
      <v-row class="ma-2">
        <v-col cols="12" xs="12" md="6" lg="4" v-for="notification in items">
          <div class="notification-box pa-5">
            <div class="text-subtitle-1 text font-weight-bold">
              {{
                notification.raw.type === "comment"
                  ? "new comment ✏️"
                  : "new like ❤️"
              }}
            </div>
            <div class="text-end text-body-2 text-medium-emphasis">
              {{
                new Date(notification.raw.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              }}
            </div>
            <div class="text-justify text-body-2 font-italic my-3">
              {{ notification.raw.text }}
            </div>
            <div class="d-flex justify-end ga-2">
              <v-btn
                icon=""
                variant="tonal"
                color="primary"
                size="small"
                density="comfortable"
                :disabled="notification.raw.read"
                @click="clickHandler(notification.raw.id, 'PATCH')"
              >
                <v-icon size="small">{{
                  notification.raw.read ? "mdi-email-open" : "mdi-email"
                }}</v-icon>
              </v-btn>
              <v-btn
                icon=""
                variant="tonal"
                color="red"
                size="small"
                density="comfortable"
                @click="clickHandler(notification.raw.id, 'DELETE')"
                ><v-icon size="small">mdi-delete</v-icon></v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
      <div class="d-flex align-center justify-center pa-4 mb-15">
        <v-btn
          :disabled="page === 1"
          icon="mdi-arrow-left"
          density="comfortable"
          variant="tonal"
          rounded
          @click="prevPage"
          color="primary"
        ></v-btn>
        <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>
        <v-btn
          :disabled="page >= pageCount"
          icon="mdi-arrow-right"
          density="comfortable"
          variant="tonal"
          rounded
          @click="nextPage"
          color="primary"
        ></v-btn>
      </div>
    </template>
  </v-data-iterator>
  <div
    v-if="!notifications.length"
    class="text-center mt-5 text-medium-emphasis font-italic text-body-1"
  >
    It seems empty
  </div>
</template>

<style>
.notification-box {
  background-color: rgb(var(--v-theme-ternary));
  border-radius: 0.5rem;
  height: 100%;
}
</style>
