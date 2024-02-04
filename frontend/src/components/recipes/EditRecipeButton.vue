<script setup>
import { computed, ref } from "vue";
import RecipeModal from "./RecipeModal.vue";
import RecipeForm from "./RecipeForm.vue";

const props = defineProps({
  recipeData: Object,
});
const dialog = ref(false);
const isOpen = computed(() => dialog);
</script>

<template>
  <v-btn
    class="justify-center ma-2"
    style="float: right"
    size="large"
    icon=""
    density="comfortable"
    @click="dialog = !dialog"
    ><v-icon color="primary"> mdi-file-edit-outline </v-icon>
  </v-btn>
  <RecipeModal
    :isOpen="isOpen"
    title="Edit Recipe"
    :isEditing="true"
    :recipeEditedId="recipeData.id"
  >
    <RecipeForm
      :isEditing="true"
      :recipeEdited="recipeData"
      :isOpen="isOpen"
    ></RecipeForm>
  </RecipeModal>
</template>

<style>
.float-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
