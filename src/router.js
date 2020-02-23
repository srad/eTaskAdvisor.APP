import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Tasks from "./views/Tasks.vue";
import Knowledge from "./views/Knowledge.vue";
import About from "./views/About.vue";
import Guide from "./views/Guide";
import Imprint from "./components/Imprint";

Vue.use(Router);

export default new Router({
  routes: [
    {path: "/", name: "Home", component: Home, meta: {title: "Home", header: false, poster: true}},
    {path: "/tasks/:activityId?", name: "Tasks", component: Tasks, meta: {title: "Planner", poster: true}},
    {path: "/guide", name: "Guide", component: Guide, meta: {title: "Guide", header: false, poster: true}},
    {path: "/knowledge", name: "Knowledge", component: Knowledge, meta: {title: "Knowledge", poster: true}},
    {path: "/imprint", name: "Imprint", component: Imprint, meta: {title: "Imprint", poster: false}},
    {path: "/about", name: "About", component: About, meta: {title: "About"}},
  ],
});