import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import Knowledge from "./views/Knowledge.vue";
import Planner from "./views/Planner.vue";
import Analytics from "./views/Analytics.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {path: "/", name: "Welcome", component: Home, title: "Home"},
    {path: "/profile", name: "Profile", component: Profile, title: "My Profile"},
    {path: "/planner", name: "Planner", component: Planner, title: "Planner"},
    {path: "/knowledge", name: "Knowledge", component: Knowledge, title: "Knowledge"},
    {path: "/about", name: "About", component: About, title: "About"},
    {path: "/analytics", name: "Analytics", component: Analytics, title: "Analytics"},
  ],
});