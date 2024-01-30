<script setup>
import DrawerNav from "./../components/navs/DrawerNav.vue";
import BottomNav from "./../components/navs/BottomNav.vue";
import TopNav from "./../components/navs/TopNav.vue";
import { firestoreDB } from "@/config.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import userStore from "@/context/loggedUser.js";
import { ref } from "vue";
const { userId } = userStore();
const recipes = ref([]);
const recipesCollection = collection(firestoreDB, "Recipes");
const query = query(recipesCollection, where("author.id", "==", userId.value));
onSnapshot(query, (snapshot) => {
  recipes.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});
</script>

<template>
  <DrawerNav class="hidden-sm-and-down">
    <h1>Notifications</h1>
    <div v-for="recipe in recipes">{{ recipe.name }}</div>
  </DrawerNav>
  <TopNav class="hidden-md-and-up">
    <h1>Notifications</h1>
    <div v-for="recipe in recipes">{{ recipe.name }}</div>
  </TopNav>
  <BottomNav class="hidden-md-and-up" />
</template>
