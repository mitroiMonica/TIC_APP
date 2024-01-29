<script setup>
import { ref } from "vue";
import { API_PHOTOS } from "@/config";

const props = defineProps({
  recipeData: Object,
});
const dialog = ref(false);
</script>

<template>
  <v-btn flat size="small" class="text-none" color="primary"
    >Read
    <v-dialog
      v-model="dialog"
      activator="parent"
      width="auto"
      class="recipe-card-container"
    >
      <v-card>
        <v-btn
          class="close-button"
          size="large"
          density="compact"
          icon=""
          @click="dialog = false"
        >
          <v-icon color="primary">mdi-close</v-icon></v-btn
        >
        <v-img
          :src="
            recipeData.picture
              ? `${API_PHOTOS}/recipes/${recipeData.picture}`
              : ''
          "
        >
        </v-img>
        <v-card-text>
          <div class="text-h6 mb-4 text-center font-weight-bold">
            {{ recipeData.name }}
          </div>
          <div class="text-subtitle-1 my-2">Ingredients:</div>
          <div v-for="ingredient in recipeData.ingredients" class="text-body-2">
            &#8674; {{ ingredient }}
          </div>
          <div class="text-subtitle-1 my-2">Preparation method:</div>
          <div class="text-body-2 font-italic text-justify">
            {{ recipeData.preparation_method }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style>
.close-button {
  float: right;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}
</style>
