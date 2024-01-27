<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
import RecipeCards from "@/components/recipes/RecipeCards.vue";
</script>

<template>
  <DrawerNav class="hidden-sm-and-down">
    <RecipeCards :areFavorites="true"></RecipeCards>
  </DrawerNav>
  <TopNav class="hidden-md-and-up">
    <RecipeCards :areFavorites="true"></RecipeCards>
  </TopNav>
  <BottomNav class="hidden-md-and-up" />
</template>
