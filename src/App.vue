<template>
  <div id="app">
    <b-navbar toggleable="sm" type="light" variant="primary" fixed="top">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <router-link to="/">
        <b-navbar-brand class="font-weight-bold text-white">
          eTaskAdviser
          <font-awesome-icon icon="graduation-cap" class="ml-3 text-white"/>
        </b-navbar-brand>
      </router-link>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item v-for="route in $router.options.routes" :key="route.path"> -->
          <b-nav-item v-for="route in allroutes" :key="route.path">
            <router-link
                :to="route.path"
                class="btn btn-block text-left text-white"
                :active-class="route.name!=='Welcome'?'text-dark':''"
            >{{route.title}}
            </router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <template v-if="$route.name!=='Welcome'">
        <h2>{{title}}</h2>
        <hr/>
      </template>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import router from "./router";

export default {
  name: "App",
  components: {},
  data() {
    return {
      title: this.$route.name,
      allroutes: router.options.routes,
    };
  },
  watch: {
    $route(to) {
      this.title = to.name;
    },
  },
};
</script>

<style lang="scss">
@import "assets/main.scss";

body {
  overflow-x: hidden;
  overflow-y: scroll;
  padding-top: 4rem;
  padding-bottom: 1rem;
}
</style>
