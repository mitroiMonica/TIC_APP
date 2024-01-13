<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { API_URL } from "@/config";
import { toast } from "vue3-toastify";
import router from "./../router/index.js";
import userStore from "@/context/loggedUser.js";

const valid = ref(false);
const email = ref("");
const password = ref("");
const verifyEmail = [
  () => {
    if (email.value) return true;
    return "Email is required";
  },
];
const verifyPassword = [
  () => {
    if (password.value) return true;
    return "Password is required";
  },
];
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const loginUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      localStorage.setItem("token", data.token);
      const { token } = userStore();
      token.value = data.token;
      router.push("/");
    }
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

<template>
  <v-container class="container">
    <div class="text-h5 text">LOGIN</div>
    <v-sheet
      elevation="13"
      rounded
      color="primary"
      class="pa-13 ma-15 mb-7 mt-7 sheet"
    >
      <v-form v-model="valid" @submit.prevent>
        <v-col>
          <v-row class="mb-6">
            <v-text-field
              v-model="email"
              label="Email"
              :rules="verifyEmail"
              required
              variant="solo"
              bg-color="ternary"
            ></v-text-field>
          </v-row>
          <v-row class="mb-6">
            <v-text-field
              v-model="password"
              label="Password"
              required
              variant="solo"
              bg-color="ternary"
              :rules="verifyPassword"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="togglePasswordVisibility"
            ></v-text-field>
          </v-row>
        </v-col>
        <v-btn
          :disabled="!valid"
          type="submit"
          variant="elevated"
          color="secondary"
          block
          @click="loginUser"
          >submit</v-btn
        >
      </v-form>
    </v-sheet>
    <i class="text text-caption">
      Don't have an account?
      <RouterLink to="/register">Register</RouterLink>
    </i>
  </v-container>
</template>

<style>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 33rem;
}

.text {
  color: rgb(var(--v-theme-primary));
  align-self: center;
}
</style>
