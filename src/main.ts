import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import { createRouter, createWebHashHistory } from "vue-router";
import CreateForm from "./components/createForm/index.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: CreateForm,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});

app.mount("#app");
