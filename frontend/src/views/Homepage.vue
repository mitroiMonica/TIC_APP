<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
import RecipeCard from "@/components/recipes/RecipeCard.vue";
</script>

<template>
  <TopNav class="hidden-md-and-up">
    <RecipeCard></RecipeCard>
  </TopNav>
  <DrawerNav class="hidden-sm-and-down">
    <RecipeCard></RecipeCard>
  </DrawerNav>
  <BottomNav class="hidden-md-and-up" />
</template>
