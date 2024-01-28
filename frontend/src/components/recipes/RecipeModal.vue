<script setup>
const props = defineProps({
  title: String,
  isOpen: Object,
  isEditing: Boolean,
});
const isOpen = props.isOpen;
</script>

<template>
  <v-overlay v-model="isOpen" class="d-flex justify-center align-center">
    <v-card v-if="isOpen" elevation="16" class="card-container">
      <v-icon
        class="text-disabled close-button"
        size="x-large"
        @click="isOpen = false"
        >mdi-close</v-icon
      >
      <template v-slot:title>
        <div class="text text-center font-weight-bold text-h5 pa-2 mt-4">
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
          @click="isOpen = false"
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
