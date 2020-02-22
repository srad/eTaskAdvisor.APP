<template>
  <div id="app">
    <b-navbar id="nav" toggleable="sm" type="light" variant="primary" class="navbar-default navbar-static-top">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <router-link to="/">
        <b-navbar-brand class="font-weight-bold text-white">
          eTaskAdvisor
          <font-awesome-icon icon="hands-helping" class="ml-3 text-white"/>
        </b-navbar-brand>
      </router-link>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item v-for="route in $router.options.routes" :key="route.path"> -->
          <b-nav-item v-for="route in allroutes" :key="route.name">
            <router-link
                class="btn btn-block text-left text-white"
                :to="{name: route.name}"
                :active-class="route.name!=='Home'?'text-dark':''"
            >{{route.meta.title}}
            </router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid class="p-3 pl-4 pr-4" :class="{'poster' : $route.meta.poster}">
      <template v-if="$route.meta.header !== false || $route.name !== 'Home'">
        <h2 class="mb-3">{{$route.meta.title}}</h2>
      </template>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import router from "./router";

export default {
  name: "App",
  data() {
    return {
      title: this.$route.name,
      allroutes: router.options.routes,
    };
  },
};
</script>

<style lang="scss">
@import "assets/main.scss";

#nav {
  z-index: 1000;
}
</style>
