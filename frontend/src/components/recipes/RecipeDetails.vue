<script setup>
import { ref } from "vue";
import { API_PHOTOS } from "@/config";
import router from "@/router/index.js";

const props = defineProps({
  recipeData: Object,
});
const dialog = ref(false);
const goToProfile = (id) => {
  if (id) {
    router.push("/profile/:" + id);
  }
};
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
        <v-container>
          <v-btn
            class="close-button"
            size="large"
            density="compact"
            icon=""
            @click="dialog = false"
          >
            <v-icon color="primary">mdi-close</v-icon></v-btn
          >
          <v-row class="pa-6" no-gutters>
            <v-col cols="12" md="5">
              <v-img
                :src="
                  recipeData.picture
                    ? `${API_PHOTOS}/recipes/${recipeData.picture}`
                    : ''
                "
                class="recipe-image"
              >
              </v-img>

              <div class="text-h6 text-center font-weight-bold text-color mt-5">
                {{ recipeData.name }}
              </div>
              <div class="d-flex justify-space-between">
                <span
                  class="text-caption font-italic text-center text-medium-emphasis"
                  style="cursor: pointer"
                  @click="goToProfile(recipeData.author.id)"
                >
                  by {{ recipeData.author.email }}
                </span>
                <span
                  class="text-caption font-italic text-medium-emphasis text-end"
                >
                  number of likes:
                  {{ recipeData.no_likes ? recipeData.no_likes : 0 }}
                </span>
              </div>
              <v-row no-gutters class="mt-5">
                <v-col
                  cols="12"
                  sm="6"
                  class=""
                  v-for="element in [
                    { name: 'category', title: 'Category: ' },
                    { name: 'preparation_time', title: 'Preparation time: ' },
                    { name: 'no_servings', title: 'Number of servings: ' },
                    { name: 'calories', title: 'Calories: ' },
                  ]"
                >
                  <span class="text-subtitle-2 font-weight-bold text-color">
                    {{ element.title }}
                  </span>
                  <span class="text-body-2">{{
                    recipeData[element.name] ? recipeData[element.name] : "-"
                  }}</span>
                </v-col>
              </v-row>
              <div class="mt-5">
                <div class="text-subtitle-2 font-weight-bold text-color mb-2">
                  Ingredients:
                </div>
                <div
                  v-for="ingredient in recipeData.ingredients"
                  class="text-body-2 mb-1"
                >
                  &#8674; {{ ingredient }}
                </div>
              </div>
              <div class="mt-5">
                <div class="text-subtitle-2 font-weight-bold text-color mb-2">
                  Tags:
                </div>
                <span
                  v-if="recipeData.tags"
                  v-for="tag in recipeData.tags"
                  class="text-body-2"
                >
                  &#183; {{ tag }}
                </span>
                <div
                  v-else
                  class="text-caption font-italic text-medium-emphasis"
                >
                  no tags
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="1" class="divider-display text-center">
              <v-divider style="height: 100%" vertical />
            </v-col>
            <v-col cols="12" md="6" class="mt-5 mt-md-0">
              <div class="text-subtitle-2 font-weight-bold text-color mb-2">
                Preparation method:
              </div>
              <div class="text-body-2 font-italic text-justify">
                {{ recipeData.preparation_method }}
              </div>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card-actions>
                <v-btn
                  color="primary"
                  border
                  block
                  @click="dialog = false"
                  class="mt-8"
                >
                  Close Dialog
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style>
.recipe-image {
  border-radius: 0.8rem;
}
.close-button {
  float: right;
  top: 1rem;
  right: 1rem;
  z-index: 1;
}
.text-color {
  color: rgb(var(--v-theme-primary));
}
.divider-display {
  @media only screen and (max-width: 960px) {
    display: none;
  }
}
</style>
