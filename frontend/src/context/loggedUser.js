import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

export const userStore = defineStore("loggedUser", () => {
  const token = ref(localStorage.getItem("token"));
  const isLogged = computed(() => (token.value ? true : false));
  const logoutHandler = () => {
    localStorage.removeItem("token");
    token.value = undefined;
    toast.success("Successfully logged out");
  };
  return {
    token: computed(() => token),
    isLogged: computed(() => isLogged),
    logoutHandler,
  };
});

export default userStore;
