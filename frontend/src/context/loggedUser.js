import { computed, ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import jwt_decode from "jwt-decode";
import router from "@/router/index.js";
import { API_URL } from "@/config";

export const userStore = defineStore("loggedUser", () => {
  const token = ref(localStorage.getItem("token"));
  const isLogged = computed(() => (token.value ? true : false));
  const userId = computed(() => {
    try {
      const decodedToken = jwt_decode(token.value);
      return decodedToken.userId;
    } catch (err) {
      return null;
    }
  });
  const userData = ref(null);
  watchEffect(async () => {
    if (userId.value) {
      try {
        const response = await fetch(`${API_URL}/users/${userId.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
          userData.value = data.userData;
        } else {
          userData.value = null;
        }
      } catch (err) {
        userData.value = null;
      }
    }
  });
  const logoutHandler = () => {
    localStorage.removeItem("token");
    token.value = undefined;
    toast.success("Successfully logged out");
  };
  const goToProfile = (id) => {
    if (id) {
      router.push("/profile/:" + id);
    }
  };
  return {
    token: computed(() => token),
    userId: computed(() => userId),
    isLogged: computed(() => isLogged),
    userData: computed(() => userData),
    logoutHandler,
    goToProfile,
  };
});

export default userStore;
