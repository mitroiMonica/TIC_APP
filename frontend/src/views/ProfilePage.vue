<script setup>
import { ref, watch, computed } from "vue";
import { toast } from "vue3-toastify";
import { API_URL } from "@/config";
import router from "@/router/index.js";
import { userStore } from "@/context/loggedUser.js";
import RecipeCards from "@/components/recipes/RecipeCards.vue";
import FloatingButton from "@/components/recipes/FloatingButton.vue";
import UserDetails from "@/components/users/UserDetails.vue";
import { firestoreDB } from "@/config.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const { userId } = userStore();
const userIdParam = router.currentRoute.value.params.id.split(":")[1];
const isLoggedUser = ref(false);
let receivedData = ref({});

const getUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/users/${userIdParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      receivedData.value = data.userData;
    }
  } catch (err) {
    toast.error(err.message);
  }
};

getUserData();
watch(receivedData, () => {
  if (receivedData.value) {
    const recipesCollection = collection(firestoreDB, "Recipes");
    const q = query(recipesCollection, where("author.id", "==", userIdParam));
    onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map((recipe) => ({ ...recipe.data() }));
      receivedData.value["no_recipes"] = recipes.length;
      receivedData.value["total_likes"] = recipes
        .map((recipe) => recipe.no_likes)
        .reduce((a, b) => a + b, 0);
      receivedData.value["no_favorites"] = receivedData.value.favorites.length;
    });
  }
});

if (userIdParam === userId.value) {
  isLoggedUser.value = true;
} else {
  isLoggedUser.value = false;
}
</script>

<template>
  <UserDetails
    :userData="computed(() => receivedData)"
    :isLoggedUser="isLoggedUser"
  >
    <RecipeCards :areUserRecipes="true" :isLoggedUser="isLoggedUser" />
    <FloatingButton v-if="userIdParam === userId" />
  </UserDetails>
</template>
