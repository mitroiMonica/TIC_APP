<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { API_URL, API_PHOTOS } from "@/config.js";
import { userStore } from "@/context/loggedUser.js";
import router from "@/router/index.js";
import EditRecipeButton from "./EditRecipeButton.vue";
import RecipeDetails from "./RecipeDetails.vue";
import { firestoreDB } from "@/config.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const { userId, userData, token, isLogged } = userStore();
const props = defineProps({
  isHomepage: Boolean,
  areFavorites: Boolean,
  areUserRecipes: Boolean,
  isLoggedUser: Boolean,
});
const search = ref("");
const sorted = ref({
  byIngredients: "",
  byLikes: "",
});
const dateIcon = ref("mdi-format-list-checkbox");
const likeIcon = ref("mdi-heart-outline");
let recipes = ref([]);
const getRecipes = async () => {
  try {
    let url = `${API_URL}/recipes`;
    if ((props.isHomepage || props.areFavorites) && userId.value) {
      url += `?userId=${userId.value}`;
    } else if (props.areUserRecipes) {
      const userIdParam = router.currentRoute.value.params.id.split(":")[1];
      url += `/user/${userIdParam}`;
      if (userId.value) {
        url += `?loggedUserId=${userId.value}`;
      }
    }
    const response = await fetch(url, {
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
      if (props.areFavorites) {
        recipes.value = data.recipes.filter((recipe) =>
          userData.value.favorites.includes(recipe.id)
        );
      } else {
        recipes.value = data.recipes;
      }
    }
  } catch (err) {
    toast.error(err.message);
  }
};
const changeFavorites = async (id) => {
  try {
    let url = `${API_URL}/users/favorites`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify({
        recipeId: id,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      userData.value.favorites = data.favorites;
      recipes.value
        .filter((recipe) => recipe.id === id)
        .forEach((recipe) => {
          if (data.favorites.includes(recipe.id)) {
            recipe.isFavorite = true;
            recipe.no_likes++;
          } else {
            recipe.isFavorite = false;
            recipe.no_likes--;
          }
        });
    }
  } catch (err) {
    toast.error(err.message);
  }
};
const goToProfile = (id) => {
  if (id) {
    router.push("/profile/:" + id);
  }
};
const resetIcons = (name, icon, mdiIcon) => {
  if (sorted.value[name] !== "") {
    sorted.value[name] = "";
    icon.value = mdiIcon;
  }
};
const sortRecipesByIngredients = () => {
  if (sorted.value.byIngredients === "") {
    sorted.value.byIngredients = "asc";
    dateIcon.value = "mdi-sort-bool-descending-variant";
    recipes.value.sort(
      (r1, r2) => r1.ingredients.length - r2.ingredients.length
    );
    resetIcons("byLikes", likeIcon, "mdi-heart-outline");
  } else if (sorted.value.byIngredients === "asc") {
    sorted.value.byIngredients = "desc";
    dateIcon.value = "mdi-sort-bool-ascending-variant";
    recipes.value.sort(
      (r1, r2) => r2.ingredients.length - r1.ingredients.length
    );
  } else {
    sorted.value.byIngredients = "";
    dateIcon.value = "mdi-format-list-checkbox";
    recipes.value.sort((r1, r2) => r2.date - r1.date);
  }
};
const sortRecipesByLikes = () => {
  if (sorted.value.byLikes === "") {
    sorted.value.byLikes = "asc";
    likeIcon.value = "mdi-heart-circle";
    recipes.value.sort((r1, r2) => r1.no_likes - r2.no_likes);
    resetIcons("byIngredients", dateIcon, "mdi-format-list-checkbox");
  } else if (sorted.value.byLikes === "asc") {
    sorted.value.byLikes = "desc";
    likeIcon.value = "mdi-heart-circle-outline";
    recipes.value.sort((r1, r2) => r2.no_likes - r1.no_likes);
  } else {
    sorted.value.byLikes = "";
    likeIcon.value = "mdi-heart-outline";
    recipes.value.sort((r1, r2) => r2.date - r1.date);
  }
};
if (props.isLoggedUser) {
  const recipesCollection = collection(firestoreDB, "Recipes");
  const q = query(recipesCollection, where("author.id", "==", userId.value));
  onSnapshot(q, (snapshot) => {
    const userRecipes = snapshot.docs
      .map((recipe) => ({
        id: recipe.id,
        ...recipe.data(),
      }))
      .sort((r1, r2) => r2.date - r1.date);
    recipes.value = userRecipes;
  });
} else {
  getRecipes();
}
</script>

<template>
  <v-data-iterator
    :items="recipes"
    :search="search"
    :items-per-page="recipes.length"
  >
    <template v-slot:header>
      <v-toolbar class="py-3 pl-8 pr-3 search-header">
        <v-text-field
          v-model="search"
          clearable
          density="comfortable"
          hide-details
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          class="pr-3"
        ></v-text-field>
        <v-btn
          size="x-large"
          density="compact"
          color="primary"
          :icon="likeIcon"
          @click="sortRecipesByLikes"
        >
        </v-btn>
        <v-btn
          size="x-large"
          density="compact"
          color="primary"
          :icon="dateIcon"
          @click="sortRecipesByIngredients"
        >
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:default="{ items }">
      <v-container class="pa-8" fluid>
        <v-row dense>
          <v-col
            v-for="item in items"
            :key="item.raw.id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
            xs="12"
            class="pa-4"
          >
            <v-card class="pb-3" elevation="3">
              <v-img
                :src="
                  item.raw.picture
                    ? `${API_PHOTOS}/recipes/${item.raw.picture}`
                    : ''
                "
              >
                <v-btn
                  v-if="
                    (isLogged && !areUserRecipes) ||
                    (isLogged &&
                      areUserRecipes &&
                      userId !==
                        router.currentRoute.value.params.id.split(':')[1])
                  "
                  class="justify-center ma-2"
                  style="float: right"
                  size="large"
                  icon=""
                  density="comfortable"
                  @click="changeFavorites(item.raw.id)"
                >
                  <v-icon :color="item.raw.isFavorite ? 'red' : '#ced4da'">
                    mdi-heart
                  </v-icon>
                </v-btn>
                <EditRecipeButton
                  v-if="
                    areUserRecipes &&
                    router.currentRoute.value.params.id.split(':')[1] === userId
                  "
                  :recipeData="item.raw"
                ></EditRecipeButton>
              </v-img>
              <v-list-item class="my-2">
                <template v-slot:title>
                  <span
                    class="text-h6 font-weight-bold"
                    style="color: rgb(var(--v-theme-primary))"
                    >{{ item.raw.name }}</span
                  >
                </template>
                <template v-slot:subtitle>
                  <div
                    class="text-caption"
                    style="cursor: pointer"
                    @click="goToProfile(item.raw.author.id)"
                  >
                    by {{ item.raw.author.email }}
                  </div>
                </template>
                <template v-slot:default>
                  <div
                    class="my-4 text-body-2 truncate-text text-justify text-medium-emphasis font-italic"
                  >
                    {{ item.raw.preparation_method }}
                  </div>
                </template>
              </v-list-item>

              <div class="d-flex justify-space-between px-4">
                <div
                  class="d-flex align-center text-caption text-medium-emphasis me-1"
                >
                  <v-icon icon="mdi-clock" start color="primary"></v-icon>
                  <div
                    class="text-truncate"
                    style="color: rgb(var(--v-theme-primary))"
                  >
                    {{
                      item.raw.preparation_time
                        ? item.raw.preparation_time
                        : "-"
                    }}
                  </div>
                </div>
                <RecipeDetails :recipeData="item.raw"></RecipeDetails>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-slot:footer>
      <div class="text-center text-caption footer-text">
        {{ recipes.length ? "no more recipies" : "no recipes" }}
      </div>
    </template>
  </v-data-iterator>
</template>

<style>
.footer-text {
  color: rgba(var(--v-theme-primary), 0.5);
  font-style: italic;
  margin-bottom: 1.5rem;
  @media only screen and (max-width: 960px) {
    margin: 4.5rem 0;
  }
}
.truncate-text {
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
}
</style>
