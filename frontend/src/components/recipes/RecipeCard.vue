<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { API_URL, API_PHOTOS } from "@/config.js";
import { userStore } from "@/context/loggedUser.js";

const { userId } = userStore();
const search = ref("");
const sorted = ref({
  byDate: "",
  byLikes: "",
});
const dateIcon = ref("mdi-clock-outline");
const likeIcon = ref("mdi-heart-outline");
const sortRecipesByDate = () => {
  if (sorted.value.byDate === "") {
    sorted.value.byDate = "asc";
    dateIcon.value = "mdi-sort-clock-ascending";
  } else if (sorted.value.byDate === "asc") {
    sorted.value.byDate = "desc";
    dateIcon.value = "mdi-sort-clock-descending";
  } else {
    sorted.value.byDate = "";
    dateIcon.value = "mdi-clock-outline";
  }
};
const sortRecipesByLikes = () => {
  if (sorted.value.byLikes === "") {
    sorted.value.byLikes = "asc";
    likeIcon.value = "mdi-heart-circle-outline";
  } else if (sorted.value.byLikes === "asc") {
    sorted.value.byLikes = "desc";
    likeIcon.value = "mdi-heart-circle";
  } else {
    sorted.value.byLikes = "";
    likeIcon.value = "mdi-heart-outline";
  }
};
let recipes = ref([]);
const getRecipes = async () => {
  try {
    let url = `${API_URL}/recipes`;
    if (userId.value) {
      url += `?userId=${userId.value}`;
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
      recipes.value = data.recipes;
    }
  } catch (err) {
    toast.error(err.message);
  }
};
getRecipes();
console.log(recipes);
</script>

<template>
  <v-data-iterator
    :items="recipes"
    :search="search"
    :items-per-page="recipes.length"
  >
    <template v-slot:header>
      <v-toolbar class="py-3 pl-6 search-header">
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
          :icon="dateIcon"
          @click="sortRecipesByDate"
        >
        </v-btn>
        <v-btn
          size="x-large"
          density="compact"
          color="primary"
          :icon="likeIcon"
          @click="sortRecipesByLikes"
        >
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:default="{ items }">
      <v-container class="pa-5" fluid>
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.title"
            cols="12"
            lg="3"
            md="4"
            sm="6"
            xs="12"
            class="pa-4"
          >
            <v-card class="pb-3" elevation="3">
              <v-img :src="`${API_PHOTOS}/recipes/${item.raw.picture}`">
                <v-btn
                  class="justify-center ma-2"
                  style="float: right"
                  size="large"
                  icon=""
                  density="comfortable"
                >
                  <v-icon color="red">mdi-heart</v-icon>
                </v-btn>
              </v-img>

              <v-list-item class="mb-2" :subtitle="item.raw.preparation_method">
                <template v-slot:title>
                  <strong class="text-h6 mb-2">{{ item.raw.name }}</strong>
                </template>
              </v-list-item>

              <div class="d-flex justify-space-between px-4">
                <div
                  class="d-flex align-center text-caption text-medium-emphasis me-1"
                >
                  <v-icon icon="mdi-clock" start></v-icon>

                  <div class="text-truncate">
                    {{ item.raw.preparation_time }}
                  </div>
                </div>

                <v-btn border flat size="small" class="text-none" text="Read">
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:footer>
      <div class="text-center text-caption footer-text">
        no more recipies
      </div></template
    >
  </v-data-iterator>
</template>

<style>
.footer-text {
  color: rgba(var(--v-theme-primary), 0.5);
  font-style: italic;
  margin-bottom: 1.5rem;
  @media only screen and (max-width: 960px) {
    margin-bottom: 4.5rem;
  }
}
</style>
