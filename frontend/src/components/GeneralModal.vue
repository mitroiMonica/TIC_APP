<script setup>
import { ref } from "vue";
const props = defineProps({
  title: String,
  customEvent: String,
});
const dialog = ref(false);
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
  <v-overlay v-model="dialog" class="d-flex justify-center align-center">
    <v-card v-if="dialog" elevation="16" class="card-container">
      <template v-slot:title>
        <div class="text text-center font-weight-bold text-h5 pa-2">
          {{ title }}
        </div>
      </template>
      <v-divider color="primary" />
      <slot></slot>
      <v-divider color="primary" />
      <div class="d-flex justify-center align-center">
        <div class="py-4 mx-2">
          <v-btn class="text-none" color="primary" rounded> Create </v-btn>
        </div>
        <div class="py-4 mx-2">
          <v-btn
            class="text-none"
            color="primary"
            rounded
            variant="outlined"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-overlay>
</template>

<style>
.text {
  color: rgb(var(--v-theme-primary));
}
.float-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
.card-container {
  width: 80vw;
  max-height: 90vh;
  overflow: auto;
}
</style>
