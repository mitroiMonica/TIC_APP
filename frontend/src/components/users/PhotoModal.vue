<script setup>
import { ref, watch } from "vue";
import { userStore } from "@/context/loggedUser.js";
import { toast } from "vue3-toastify";
import { API_URL } from "@/config.js";

const { token, userData } = userStore();
const props = defineProps({
  isOpen: Object,
});
const dialog = ref(props.isOpen.dialog);
const picture = ref(undefined);
const url = ref(undefined);
const valid = ref(false);
const pictureRule = [
  (value) => {
    const file = value[0];
    if (file && file.type.split("/")[0] === "image") return true;
    else if (file) return "File should be an image!";
    return true;
  },
];
const closeModal = () => {
  dialog.value = false;
  picture.value = undefined;
};
watch(picture, () => {
  if (
    picture.value &&
    picture.value.length &&
    picture.value[0].type.split("/")[0] === "image"
  ) {
    url.value = URL.createObjectURL(picture.value[0]);
    valid.value = true;
  } else {
    url.value = undefined;
    valid.value = false;
  }
});
const saveNewPhoto = async () => {
  try {
    const formData = new FormData();
    formData.append("photo", picture.value[0]);
    const response = await fetch(`${API_URL}/users/updatePhoto`, {
      method: "PATCH",
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
      userData.value = { ...userData.value, photo: data.filename };
      closeModal();
    }
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

<template>
  <v-overlay v-model="dialog" class="d-flex justify-center align-center">
    <v-card v-if="dialog" elevation="16" class="card-container-photo">
      <template v-slot:title>
        <div class="text text-center font-weight-bold text-h5 pa-2">
          Change photo
        </div>
      </template>
      <v-divider color="primary" />
      <div v-if="url" class="preview ma-8">
        <img v-if="url" :src="url" />
      </div>
      <v-file-input
        class="ma-8 mb-4 input-file"
        v-model="picture"
        label="Picture"
        :rules="pictureRule"
        variant="solo"
        bg-color="ternary"
        prepend-icon=""
        accept="image/*"
      ></v-file-input>
      <v-divider color="primary" />
      <div class="my-6 mx-8 text-end">
        <v-btn
          class="text-none mr-2"
          color="primary"
          rounded
          :disabled="!valid"
          @click="saveNewPhoto"
        >
          Save
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          rounded
          variant="outlined"
          @click="closeModal"
        >
          Close
        </v-btn>
      </div>
    </v-card>
  </v-overlay>
</template>

<style>
.text {
  color: rgb(var(--v-theme-primary));
}
.card-container-photo {
  min-width: 50vw;
  max-width: 70vw;
  max-height: 90vh;
  overflow: auto;
}
.input-file {
  overflow: auto;
}
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview img {
  max-width: 100%;
  max-height: 500px;
}
</style>
