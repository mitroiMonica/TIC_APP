<script setup>
import { API_URL } from "@/config.js";
import { toast } from "vue3-toastify";
import userStore from "@/context/loggedUser.js";

const { token } = userStore();
const props = defineProps({
  title: String,
  isOpen: Object,
  isEditing: Boolean,
  recipeEditedId: String,
});
const isOpen = props.isOpen;
const buttonHandler = async () => {
  if (props.isEditing) {
    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.value,
        },
        body: JSON.stringify({
          recipeId: props.recipeEditedId,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "fail") {
        toast.error(data.message);
      } else if (data.status === "success") {
        toast.success(data.message);
        isOpen.value = false;
      }
    } catch (err) {
      toast.error(err.message);
    }
  } else {
    isOpen.value = false;
  }
};
</script>

<template>
  <v-overlay v-model="isOpen" class="d-flex justify-center align-center">
    <v-card v-if="isOpen" elevation="16" class="card-container">
      <v-icon
        class="text-disabled close-button"
        size="x-large"
        @click="isOpen = false"
        >mdi-close
      </v-icon>
      <template v-slot:title>
        <div class="text text-center font-weight-bold text-h5 pa-2">
          {{ title }}
        </div>
      </template>
      <v-divider color="primary" />
      <slot></slot>
      <div class="py-6 px-2 button-align text-start">
        <v-btn
          class="text-none"
          :color="isEditing ? 'red' : 'primary'"
          rounded
          :variant="isEditing ? 'tonal' : 'outlined'"
          @click="buttonHandler"
        >
          {{ isEditing ? "Delete" : "Close" }}
        </v-btn>
      </div>
    </v-card>
  </v-overlay>
</template>

<style>
.text {
  color: rgb(var(--v-theme-primary));
}
.card-container {
  width: 80vw;
  max-height: 90vh;
  overflow: auto;
}
.button-align {
  width: 50%;
  display: inline-block;
}
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
