<script setup>
const items = [
  {
    icon: "mdi-home",
    title: "Homepage",
    value: "homepage",
  },
  {
    icon: "mdi-heart",
    title: "Favorites",
    value: "favorites",
  },
  {
    icon: "mdi-bell",
    title: "Notifications",
    value: "notifications",
  },
];
</script>

<template>
  <v-layout class="overflow-visible">
    <v-bottom-navigation grow class="nav-container">
      <v-btn
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        color="ternary"
        :prepend-icon="item.icon"
        class="custom-item"
        :to="item.value === 'homepage' ? '/' : `/${item.value}`"
      >
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<style>
.nav-container {
  background-color: rgb(var(--v-theme-primary));
}
.custom-item {
  color: rgb(var(--v-theme-ternary));
}
</style>
