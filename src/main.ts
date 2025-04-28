// import { createApp } from "vue";
// import { createPinia } from "pinia";
// import { createRouter, createWebHistory } from "vue-router";
// import Vue3Toastify from "vue3-toastify";
// import "vue3-toastify/dist/index.css";

// import "./styles/main.css";
// import App from "./App.vue";
// import routes from "./router";

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// const pinia = createPinia();
// const app = createApp(App);

// app.use(router);
// app.use(pinia);
// app.use(Vue3Toastify, {
//   autoClose: 3000,
//   position: "top-right",
// });

// app.mount("#app");
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./styles/main.css";
import App from "./App.vue";
import routes from "./router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Add the persisted state plugin
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});

app.mount("#app");
