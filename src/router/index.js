import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import SimulationView from "../views/SimulationView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/simulation",
      component: SimulationView,
    },
  ],
});

export default router;
