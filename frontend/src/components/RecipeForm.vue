<script setup>
import { ref } from "vue";
import { API_URL } from "@/config";
import { toast } from "vue3-toastify";
import router from "./../router/index.js";
import userStore from "@/context/loggedUser.js";
const valid = ref(false);
const name = ref("");
const picture = ref(undefined);
const category = ref("");
const preparation_time = ref(undefined);
const no_servings = ref(undefined);
const calories = ref(undefined);
const tags = ref(undefined);
const ingredients = ref(undefined);
const preparation_method = ref(undefined);
const requiredRule = (field) => () => {
  if (field) return true;
  return "This field is required";
};
const pictureRule = [
  (value) => {
    const file = value[0];
    if (file && file.type.split("/")[0] === "image") return true;
    else if (file) return "File should be an image!";
    return true;
  },
];
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
  <v-form v-model="valid" @submit.prevent class="pa-8">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="name"
            label="Name*"
            :rules="[requiredRule(name)]"
            variant="solo"
            bg-color="ternary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-file-input
            v-model="picture"
            label="Picture"
            :rules="pictureRule"
            variant="solo"
            bg-color="ternary"
            prepend-icon=""
          ></v-file-input>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="category"
            label="Category"
            variant="solo"
            bg-color="ternary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="preparation_time"
            label="Preparation time"
            variant="solo"
            bg-color="ternary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="no_servings"
            label="Number of servings"
            variant="solo"
            bg-color="ternary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="calories"
            label="Calories"
            variant="solo"
            bg-color="ternary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-textarea
            v-model="ingredients"
            :rules="[requiredRule(ingredients)]"
            label="Ingredients*"
            variant="solo"
            bg-color="ternary"
          ></v-textarea>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-textarea
            v-model="preparation_method"
            :rules="[requiredRule(preparation_method)]"
            label="Preparation method*"
            variant="solo"
            bg-color="ternary"
          ></v-textarea>
        </v-col>

        <v-col cols="12" xs="12" sm="12" md="4">
          <v-textarea
            v-model="tags"
            label="Tags"
            variant="solo"
            bg-color="ternary"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style>
.text {
  color: rgb(var(--v-theme-primary));
  align-self: center;
}
</style>
