<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { API_URL } from "@/config";
import UserDetails from "./../components/UserDetails.vue";
import router from "@/router/index.js";
import GeneralModal from "@/components/GeneralModal.vue";
import RecipeForm from "@/components/RecipeForm.vue";
const userId = router.currentRoute.value.params.id.split(":")[1];
const userData = ref({});
const getUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
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
      userData.value = data.userData;
    }
  } catch (err) {
    toast.error(err.message);
  }
};
getUserData();
</script>

<template>
  <UserDetails :userData="userData">
    <GeneralModal title="Create Recipe">
      <RecipeForm></RecipeForm>
    </GeneralModal>
  </UserDetails>
</template>
