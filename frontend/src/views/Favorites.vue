<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
</script>

<template>
  <DrawerNav class="hidden-sm-and-down">
    <h1>Favorites</h1>
  </DrawerNav>
  <TopNav class="hidden-md-and-up">
    <h1>Favorites</h1>
  </TopNav>
  <BottomNav class="hidden-md-and-up" />
</template>
