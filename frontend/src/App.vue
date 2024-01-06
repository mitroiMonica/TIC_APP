<script setup>
import { RouterLink, RouterView } from "vue-router";
import SignPage from "./views/SignPage.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <!-- <RouterLink to="/">Home</RouterLink> -->
        <!-- <RouterLink to="/about">About</RouterLink> -->
      </nav>
    </div>
  </header>
  <RouterView />
  <SignPage />
</template>
