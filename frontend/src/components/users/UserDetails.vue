<script setup>
import { API_PHOTOS } from "@/config.js";
import PhotoModal from "./PhotoModal.vue";
import { ref } from "vue";
import { firestoreDB } from "@/config.js";
import { doc, onSnapshot } from "firebase/firestore";
import { watch } from "vue";
import { userStore } from "@/context/loggedUser.js";

const props = defineProps({
  userData: Object,
  isLoggedUser: Boolean,
});
const { userId } = userStore();
const userData = props.userData;
const items = [
  {
    title: "Recipes",
    property: "no_recipes",
  },
  {
    title: "Likes",
    property: "total_likes",
  },
  {
    title: "Liked",
    property: "no_favorites",
  },
];
const isOpen = { dialog: ref(false) };
const openModal = () => {
  isOpen.dialog.value = true;
};
watch(props.userData, () => {
  if (props.isLoggedUser) {
    const userDoc = doc(firestoreDB, "Users", userId.value);
    onSnapshot(userDoc, (snapshot) => {
      userData.value.photo = snapshot.data().photo;
    });
  }
});
</script>

<template>
  <div
    v-if="userData && Object.keys(userData).length !== 0"
    class="d-flex flex-md-row flex-column"
  >
    <v-sheet
      elevation="8"
      class="pa-5 d-flex flex-md-column flex-row justify-space-evenly align-center details-container"
      color="primary"
    >
      <div class="d-flex flex-column align-center">
        <v-avatar
          size="80"
          color="ternary"
          :class="isLoggedUser ? 'avatar-container' : ''"
          @click="openModal"
        >
          <v-img
            v-if="userData.photo"
            :src="`${API_PHOTOS}/users/${userData.photo}`"
            alt="user-photo"
          />
          <span v-else class="text-h4 text">{{ userData.email[0] }}</span>
        </v-avatar>
        <span class="mt-3">{{ userData.email.split("@")[0] }} </span>
        <span class="text-caption">@{{ userData.email.split("@")[1] }}</span>
      </div>
      <div class="d-flex flex-md-column flex-row align-center">
        <div v-for="item in items" class="d-flex flex-column align-center ma-5">
          <span class="text-h5 font-weight-bold">{{
            userData[item.property] ? userData[item.property] : 0
          }}</span>
          <span>{{ item.title }}</span>
        </div>
      </div>
    </v-sheet>
    <PhotoModal :isOpen="isOpen" v-if="isLoggedUser"></PhotoModal>
    <div class="recipes-container">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.details-container {
  height: 100vh;
  position: sticky;
  z-index: 1;
  top: 0;
  @media only screen and (max-width: 960px) {
    height: auto;
  }
}
.text {
  color: rgb(var(--v-theme-primary));
}
.avatar-container {
  cursor: pointer;
}
.recipes-container {
  width: 100%;
}
</style>
