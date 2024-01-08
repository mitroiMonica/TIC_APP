<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-toolbar-title class="title text-body">Instagram</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-avatar
          image="https://randomuser.me/api/portraits/men/85.jpg"
          class="avatar"
        ></v-avatar>
        <v-btn variant="text" icon="mdi-logout"></v-btn>
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
