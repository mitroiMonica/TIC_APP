<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { firestoreDB } from "@/config.js";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { API_URL } from "@/config.js";
import userStore from "@/context/loggedUser.js";

const props = defineProps({
  recipeData: Object,
});
const { token, userId } = userStore();
const addComment = ref(false);
const commentText = ref("");
const comments = ref([]);
const editingComment = ref(undefined);
const editText = ref("");
const recipeDoc = doc(firestoreDB, "Recipes", props.recipeData.id);
const commentsCollection = collection(recipeDoc, "Comments");
onSnapshot(commentsCollection, (snapshot) => {
  const recipeComments = snapshot.docs
    .map((comment) => ({
      id: comment.id,
      ...comment.data(),
    }))
    .sort((c1, c2) => c2.date - c1.date);
  comments.value = recipeComments;
});
const saveComment = async () => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify({
        text: commentText.value,
        recipeId: props.recipeData.id,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      commentText.value = "";
      addComment.value = false;
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};
const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify({
        recipeId: props.recipeData.id,
        commentId,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};
const updateComment = async (commentId) => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify({
        recipeId: props.recipeData.id,
        commentId,
        text: editText.value,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "fail") {
      toast.error(data.message);
    } else if (data.status === "success") {
      editingComment.value = undefined;
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};
const editHandler = (commentId, commentText) => {
  editText.value = commentText;
  editingComment.value = commentId;
};
</script>

<template>
  <div class="text-subtitle-2 font-weight-bold text-color mb-2">Comments:</div>
  <div
    v-if="!comments.length"
    class="text-caption text-medium-emphasis font-italic"
  >
    No comments yet! Be the first to add one.
  </div>
  <div v-else="comments.length">
    <div v-for="comment in comments">
      <div v-if="editingComment !== comment.id" class="mb-3 pa-3 comment-box">
        <div
          class="d-flex justify-space-between text-caption text-medium-emphasis"
        >
          <span>{{ comment.author.email }}</span>
          <span>{{
            new Date(comment.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          }}</span>
        </div>
        <div class="d-flex justify-space-between align-center mt-1 ga-5">
          <div class="text-body-2 text-wrap" style="word-break: break-all">
            <span class="text-caption text-medium-emphasis">
              {{ comment.edited ? "[edited]" : null }}
            </span>
            {{ comment.text }}
          </div>
          <div class="d-flex ga-1" v-if="comment.author.id === userId">
            <v-btn
              density="comfortable"
              size="small"
              icon=""
              @click="editHandler(comment.id, comment.text)"
            >
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              density="comfortable"
              size="small"
              icon=""
              @click="deleteComment(comment.id)"
            >
              <v-icon color="primary">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else="editingComment === comment.id" class="mb-5">
        <v-text-field
          name="comment"
          placeholder="your comment ..."
          variant="solo-filled"
          density="comfortable"
          v-model="editText"
        ></v-text-field>
        <div class="d-flex ga-2">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            class="text-none"
            :disabled="editText === comment.text"
            @click="updateComment(comment.id)"
          >
            Edit
          </v-btn>
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            class="text-none"
            @click="editingComment = undefined"
          >
            Cancel
          </v-btn>
        </div>
      </div>
    </div>
  </div>

  <v-btn
    v-if="!addComment"
    size="small"
    color="primary"
    variant="tonal"
    style="float: right"
    class="text-none mt-2"
    @click="addComment = true"
  >
    Add comment
  </v-btn>
  <div v-else="addComment" class="mt-2">
    <v-text-field
      name="comment"
      placeholder="your comment ..."
      variant="solo-filled"
      density="comfortable"
      v-model="commentText"
    ></v-text-field>
    <div style="float: right" class="d-flex ga-2">
      <v-btn
        size="small"
        color="primary"
        variant="tonal"
        class="text-none"
        :disabled="!commentText"
        @click="saveComment"
      >
        Save
      </v-btn>
      <v-btn
        size="small"
        color="primary"
        variant="tonal"
        class="text-none"
        @click="addComment = false"
      >
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<style>
.comment-box {
  background-color: rgb(var(--v-theme-ternary));
  border-radius: 0.5rem;
}
</style>
