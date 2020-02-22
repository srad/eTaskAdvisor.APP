import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Tasks from "./views/Tasks.vue";
import Knowledge from "./views/Knowledge.vue";
// import Planner from "./views/Planner.vue";
// import Place from "./views/Place.vue";
// import Analytics from "./views/Analytics.vue";
import About from "./views/About.vue";
import Guide from "./views/Guide";

Vue.use(Router);

export default new Router({
  routes: [
    {path: "/", name: "Home", component: Home, meta: {title: "Home", header: false, poster: true}},
    {path: "/tasks/:activityId?", name: "Tasks", component: Tasks, meta: {title: "Planner"}},
    {path: "/guide", name: "Guide", component: Guide, meta: {title: "Guide", header: false, poster: true}},
    // {path: "/planner", name: "Planner", component: Planner, title: "Planner"},
    // {path: "/places", name: "Places", component: Place, title: "Places"},
    {path: "/knowledge", name: "Knowledge", component: Knowledge, meta: {title: "Knowledge", poster: false}},
    {path: "/about", name: "About", component: About, meta: {title: "About"}},
    // {path: "/analytics", name: "Analytics", component: Analytics, title: "Analytics"},
  ],
});