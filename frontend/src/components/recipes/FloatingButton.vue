<script setup>
import { computed, ref } from "vue";
import RecipeModal from "./RecipeModal.vue";
import RecipeForm from "./RecipeForm.vue";
const dialog = ref(false);
const isOpen = computed(() => dialog);
</script>

<template>
  <v-btn
    class="float-button"
    @click="dialog = !dialog"
    size="x-large"
    color="primary"
    density="compact"
    icon="mdi-plus"
    elevation="5"
  />
  <RecipeModal :isOpen="isOpen" title="Create Recipe">
    <RecipeForm :isOpen="isOpen"></RecipeForm>
  </RecipeModal>
</template>

<style>
.float-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
