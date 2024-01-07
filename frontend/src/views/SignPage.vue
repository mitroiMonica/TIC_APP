<script setup>
import { ref } from "vue";
const valid = ref(false);
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const verifyEmail = [
  () => {
    if (email.value) return true;
    return "Email is required";
  },
  () => {
    if (/.+@.+\..+/.test(email.value)) return true;
    return "Email must be valid";
  },
];
const verifyPassword = [
  () => {
    if (password.value) return true;
    return "Password is required";
  },
  () => {
    if (password.value.length >= 8) return true;
    return "Password must have at least 8 characters";
  },
];
const verifyPasswordConfirm = [
  () => {
    if (passwordConfirm.value) return true;
    return "Password is required";
  },
  () => {
    if (passwordConfirm.value === password.value) return true;
    return "Passwords must match";
  },
];

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onClickHandler = () => {
  console.log("LOGION");
};
</script>

<template>
  <v-container class="container">
    <div class="text-h5 text">REGISTER</div>
    <v-sheet
      elevation="13"
      rounded
      color="primary"
      class="pa-13 ma-15 mb-7 mt-7 sheet"
    >
      <v-form v-model="valid">
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
          <v-row class="mb-6">
            <v-text-field
              v-model="passwordConfirm"
              label="Password Confirm"
              required
              variant="solo"
              :rules="verifyPasswordConfirm"
              type="password"
              bg-color="ternary"
            >
            </v-text-field>
          </v-row>
        </v-col>
        <v-btn
          :disabled="!valid"
          type="submit"
          variant="elevated"
          color="secondary"
          block
          >submit</v-btn
        >
      </v-form>
    </v-sheet>
    <p class="text text-caption">
      <i>Do you have an account?</i>
      <b class="button" @click="onClickHandler"> Login</b>
    </p>
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
.button {
  cursor: pointer;
}
</style>
