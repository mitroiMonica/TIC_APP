<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
import Notifications from "./../components/notifications/Notification.vue";
</script>

<template>
  <DrawerNav class="hidden-sm-and-down">
    <Notifications></Notifications>
  </DrawerNav>
  <TopNav class="hidden-md-and-up">
    <Notifications></Notifications>
  </TopNav>
  <BottomNav class="hidden-md-and-up" />
</template>
