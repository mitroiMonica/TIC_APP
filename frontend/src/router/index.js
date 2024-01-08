import { createRouter, createWebHistory } from "vue-router";
import SignPage from "./../views/SignPage.vue";
import Homepage from "./../views/Homepage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/register",
      name: "register",
      component: SignPage,
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("./../views/LoginPage.vue"),
    },
    {
      path: "/",
      name: "homepage",
      component: Homepage,
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("./../views/Favorites.vue"),
    },
    {
      path: "/notifications",
      name: "notifications",
      component: () => import("./../views/Notifications.vue"),
    },
  ],
});

export default router;
