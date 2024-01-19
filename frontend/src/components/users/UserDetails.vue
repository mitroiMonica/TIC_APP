<script setup>
import { API_PHOTOS } from "@/config.js";
import PhotoModal from "./PhotoModal.vue";
import { ref, computed } from "vue";
const props = defineProps({
  userData: Object,
});
const items = [
  {
    title: "Recipes",
    number: 100,
  },
  {
    title: "Likes",
    number: 1320,
  },
  {
    title: "Liked",
    number: 91,
  },
];
const isOpen = { dialog: ref(false) };
const openModal = () => {
  isOpen.dialog.value = true;
};
</script>

<template>
  <div
    v-if="Object.keys(userData).length !== 0"
    class="d-flex flex-md-row flex-column details-container"
  >
    <v-sheet
      elevation="8"
      class="pa-5 d-flex flex-md-column flex-row justify-space-evenly align-center"
      color="primary"
    >
      <div class="d-flex flex-column align-center">
        <v-avatar
          size="80"
          color="ternary"
          class="avatar-container"
          @click="openModal"
        >
          <v-img
            v-if="userData.photo"
            :src="`${API_PHOTOS}${userData.photo}`"
            alt="user-photo"
          />
          <span v-else class="text-h4 text">{{ userData.email[0] }}</span>
        </v-avatar>
        <span class="mt-3">{{ userData.email.split("@")[0] }} </span>
        <span class="text-caption">@{{ userData.email.split("@")[1] }}</span>
      </div>
      <div class="d-flex flex-md-column flex-row align-center">
        <div v-for="item in items" class="d-flex flex-column align-center ma-5">
          <span class="text-h5 font-weight-bold">{{ item.number }}</span>
          <span>{{ item.title }}</span>
        </div>
      </div>
    </v-sheet>
    <div class="ma-5">
      <slot></slot>
    </div>
    <PhotoModal :isOpen="isOpen"></PhotoModal>
  </div>
</template>

<style>
.details-container {
  height: 100vh;
}
.text {
  color: rgb(var(--v-theme-primary));
}
.avatar-container {
  cursor: pointer;
}
</style>
