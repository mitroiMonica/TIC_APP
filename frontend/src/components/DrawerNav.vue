<script setup>
import userStore from "./../context/loggedUser.js";
import { ref, computed } from "vue";
import router from "./../router/index.js";
const drawer = ref(true);
const rail = ref(true);
const { isLogged, logoutHandler, goToProfile, userId, userData } = userStore();
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
      ]
);
const clickHandler = () => {
  if (isLogged.value) {
    logoutHandler();
  } else {
    router.push("/login");
  }
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
          v-if="isLogged && userData"
          :class="rail ? 'd-flex' : 'mt-3 mb-3 pa-3'"
          class="custom-list-item show-pointer"
          @click="goToProfile(userId)"
          ><v-avatar
            v-if="isLogged && userData"
            :image="userData.photo"
            class="avatar"
            @click="goToProfile(userId)"
            color="ternary"
            :size="rail ? '21' : '40'"
          >
            <span :class="rail ? 'text-caption' : 'text-h6'">{{
              userData.email[0]
            }}</span>
          </v-avatar>
          <span v-if="!rail" class="font-weight-bold">
            {{ userData.email.split("@")[0] }}
          </span>
        </v-list-item>

        <v-divider v-if="isLogged" color="ternary" />
        <v-divider v-if="isLogged" color="ternary" />

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
              @click="clickHandler"
              >{{ isLogged ? "Logout" : "Login" }}</v-btn
            >
            <v-list-item
              v-else
              :prepend-icon="isLogged ? 'mdi-logout' : 'mdi-login'"
              :title="isLogged ? 'Logout' : 'Login'"
              :value="isLogged ? 'logout' : 'login'"
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
