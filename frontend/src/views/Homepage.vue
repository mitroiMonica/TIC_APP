<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
</script>

<template>
  <TopNav class="hidden-md-and-up">
    <h1>Homepage</h1>
  </TopNav>
  <DrawerNav class="hidden-sm-and-down">
    <h1>Homepage</h1>
  </DrawerNav>
  <BottomNav class="hidden-md-and-up" />
</template>
