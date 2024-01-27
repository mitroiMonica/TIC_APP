<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
import RecipeCards from "@/components/recipes/RecipeCards.vue";
</script>

<template>
  <TopNav class="hidden-md-and-up">
    <RecipeCards :isHomepage="true"></RecipeCards>
  </TopNav>
  <DrawerNav class="hidden-sm-and-down">
    <RecipeCards :isHomepage="true"></RecipeCards>
  </DrawerNav>
  <BottomNav class="hidden-md-and-up" />
</template>
