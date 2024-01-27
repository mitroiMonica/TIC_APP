<script setup>
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import { API_URL } from "@/config";
import UserDetails from "./../components/users/UserDetails.vue";
import router from "@/router/index.js";
import GeneralModal from "@/components/recipes/RecipeModal.vue";
import RecipeForm from "@/components/recipes/RecipeForm.vue";
import { userStore } from "@/context/loggedUser.js";
import RecipeCards from "@/components/recipes/RecipeCards.vue";

const { userId, userData } = userStore();
const userIdParam = router.currentRoute.value.params.id.split(":")[1];
const isLoggedUser = ref(false);
let searchUserData;
let receiveData = ref({});

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
      receiveData.value = data.userData;
    }
  } catch (err) {
    toast.error(err.message);
  }
};

if (userIdParam === userId.value) {
  isLoggedUser.value = true;
  searchUserData = computed(() => userData);
} else {
  getUserData();
  searchUserData = computed(() => receiveData);
  isLoggedUser.value = false;
}
</script>

<template>
  <UserDetails :userData="searchUserData" :isLoggedUser="isLoggedUser">
    <RecipeCards :areUserRecipes="true"></RecipeCards>
    <GeneralModal title="Create Recipe">
      <RecipeForm></RecipeForm>
    </GeneralModal>
  </UserDetails>
</template>
