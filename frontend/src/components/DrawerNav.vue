<script setup>
import { ref } from "vue";

const drawer = ref(true);
const rail = ref(true);
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
const logoutHandler = () => {
  localStorage.clear("token");
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="nav-container"
        v-model="drawer"
        :rail="rail"
        permanent
        @mouseenter="rail = false"
        @mouseleave="rail = true"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :class="rail ? '' : 'mt-3 mb-3'"
          title="Mitroi Daniela-Monica"
          class="custom-list-item show-pointer"
        >
        </v-list-item>

        <v-divider color="ternary" />
        <v-divider color="ternary" />

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in items"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.value"
            :key="item.value"
            class="custom-list-item"
            :to="item.value === 'homepage' ? '/' : `/${item.value}`"
          ></v-list-item>
        </v-list>

        <template v-slot:append>
          <div :class="rail ? 'mb-1' : 'ma-3'">
            <v-btn
              v-if="!rail"
              block
              size="small"
              color="ternary"
              @click="logoutHandler"
              >Logout</v-btn
            >
            <v-list-item
              v-else
              prepend-icon="mdi-logout"
              title="Logout"
              value="logout"
              class="custom-list-item"
            />
          </div>
        </template>
      </v-navigation-drawer>
      <v-main><slot></slot></v-main>
    </v-layout>
  </v-card>
</template>

<style>
.nav-container {
  background-color: rgb(var(--v-theme-primary));
}
.custom-list-item {
  color: rgb(var(--v-theme-ternary));
}
.show-pointer {
  cursor: pointer;
}
</style>
