<script setup>
import { computed } from "vue";
import userStore from "@/context/loggedUser.js";
const { isLogged, userUnreadNotifications } = userStore();
const items = computed(() =>
  isLogged.value
    ? [
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
      ]
    : [
        {
          icon: "mdi-home",
          title: "Homepage",
          value: "homepage",
        },
        {
          icon: "mdi-login",
          title: "Login",
          value: "login",
        },
      ]
);
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
        <template
          v-slot:prepend
          v-if="item.value === 'notifications' && userUnreadNotifications !== 0"
        >
          <v-badge
            color="error"
            :content="userUnreadNotifications"
            offset-y="7"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>
        </template>
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
