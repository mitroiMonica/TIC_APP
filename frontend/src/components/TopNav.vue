<script setup>
import userStore from "./../context/loggedUser.js";
const { isLogged, logoutHandler, goToProfile, userId, userData } = userStore();
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-toolbar-title :class="`title  ${isLogged ? '' : ' text-center'}`"
          >Instagram</v-toolbar-title
        >
        <v-spacer v-if="isLogged" />
        <v-avatar
          v-if="isLogged && userData"
          :image="userData.photo"
          class="avatar"
          @click="goToProfile(userId)"
          color="ternary"
        >
          <span class="text">{{ userData.email[0] }}</span>
        </v-avatar>
        <v-btn
          v-if="isLogged"
          @click="logoutHandler"
          variant="text"
          icon="mdi-logout"
        />
      </v-app-bar>
      <v-main>
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style>
.title {
  font-style: italic;
  color: rgb(var(--v-theme-ternary));
}
.avatar {
  margin-right: 1rem;
  cursor: pointer;
}
</style>
