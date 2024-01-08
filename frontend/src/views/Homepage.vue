<script setup>
import DrawerNav from "./../components/DrawerNav.vue";
import BottomNav from "./../components/BottomNav.vue";
import TopNav from "./../components/TopNav.vue";
</script>

<template>
  <DrawerNav class="hidden-sm-and-down">
    <h1>Homepage</h1>
  </DrawerNav>
  <TopNav class="hidden-md-and-up">
    <h1>Homepage</h1>
  </TopNav>
  <BottomNav class="hidden-md-and-up" />
</template>
