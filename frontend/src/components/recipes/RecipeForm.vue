<script setup>
import { ref } from "vue";
import { API_URL } from "@/config";
import { toast } from "vue3-toastify";
import userStore from "@/context/loggedUser.js";

const props = defineProps({
  isEditing: Boolean,
  recipeEdited: Object,
  isOpen: Object,
});
const { token, userData } = userStore();
const valid = ref(false);
const name = ref(props.recipeEdited ? props.recipeEdited.name : undefined);
const picture = ref(undefined);
const category = ref(
  props.recipeEdited ? props.recipeEdited.category : undefined
);
const preparation_time = ref(
  props.recipeEdited ? props.recipeEdited.preparation_time : undefined
);
const no_servings = ref(
  props.recipeEdited ? props.recipeEdited.no_servings : undefined
);
const calories = ref(
  props.recipeEdited ? props.recipeEdited.calories : undefined
);
const tags = ref(props.recipeEdited ? props.recipeEdited.tags : undefined);
const ingredients = ref(
  props.recipeEdited ? props.recipeEdited.ingredients : undefined
);
const preparation_method = ref(
  props.recipeEdited ? props.recipeEdited.preparation_method : undefined
);
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
const clearFileds = () => {
  name.value = undefined;
  picture.value = undefined;
  category.value = undefined;
  preparation_time.value = undefined;
  no_servings.value = undefined;
  calories.value = undefined;
  tags.value = undefined;
  ingredients.value = undefined;
  preparation_method.value = undefined;
};
const modifyRecipes = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("ingredients", ingredients.value);
    formData.append("preparation_method", preparation_method.value);
    if (category.value) {
      formData.append("category", category.value);
    }
    if (preparation_time.value) {
      formData.append("preparation_time", preparation_time.value);
    }
    if (no_servings.value) {
      formData.append("no_servings", no_servings.value);
    }
    if (calories.value) {
      formData.append("calories", calories.value);
    }
    if (tags.value) {
      formData.append("tags", tags.value);
    }
    if (picture.value) {
      formData.append("photo", picture.value[0]);
    }
    let method = "POST";
    if (props.isEditing) {
      method = "PATCH";
      formData.append("recipeId", props.recipeEdited.id);
    }
    const response = await fetch(`${API_URL}/recipes`, {
      method,
      headers: {
        Authorization: "Bearer " + token.value,
      },
      body: formData,
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      toast.success(data.message);
      if (!props.isEditing) {
        userData.value.no_recipes += 1;
        clearFileds();
      }
      props.isOpen.value = false;
    }
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent class="pa-8 pb-4">
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
            style="overflow: auto"
            v-model="picture"
            label="Picture"
            :rules="pictureRule"
            variant="solo"
            bg-color="ternary"
            prepend-icon=""
            accept="image/*"
            :messages="isEditing ? 'Picture remains is not changed' : ''"
          ></v-file-input>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="category"
            label="Category"
            variant="solo"
            bg-color="ternary"
            placeholder="dinner/breakfast/..."
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="preparation_time"
            label="Preparation time"
            variant="solo"
            bg-color="ternary"
            placeholder="1h 10m"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="no_servings"
            label="Number of servings"
            variant="solo"
            bg-color="ternary"
            placeholder="3"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-text-field
            v-model="calories"
            label="Calories"
            variant="solo"
            bg-color="ternary"
            placeholder="300"
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4">
          <v-textarea
            v-model="ingredients"
            :rules="[requiredRule(ingredients)]"
            label="Ingredients*"
            variant="solo"
            bg-color="ternary"
            placeholder="ingredient 1, ingredient 2, ..."
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
            placeholder="tag 1, tag 2, ..."
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <v-divider color="primary" />
  <div class="py-6 px-2 button-align text-end">
    <v-btn
      class="text-none"
      color="primary"
      rounded
      :disabled="!valid"
      @click="modifyRecipes"
    >
      {{ isEditing ? "Edit" : "Create" }}
    </v-btn>
  </div>
</template>

<style>
.text {
  color: rgb(var(--v-theme-primary));
  align-self: center;
}
.button-align {
  width: 50%;
  display: inline-block;
}
</style>
