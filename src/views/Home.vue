<template>
  <b-row>
    <b-col cols="3" class="d-none d-md-block"></b-col>

    <b-col class="home-message pt-4 pb-4 m-2">
      <b-row>
        <b-col class="text-center">
          <h3>Welcome to</h3>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <font-awesome-icon icon="hands-helping" size="3x" class="mt-3 mb-3"/>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <h3>eTaskAdvisor</h3>
          <h6 class="m-4">
            This app will help you to improve your learning process with the latest knowledge from research
          </h6>
          <p class="position-static mb-4 align-bottom text-monospace">
            By using this app you agree and allow us to track your data anonymously and to use cookies.
            More see
            <router-link to="imprint" class="text-warning">here</router-link>
          </p>
          <br/>
          <router-link tag="button" class="btn-lg btn btn-primary shadow-sm w-75" style="height: 4rem" to="/guide">Start</router-link>
        </b-col>
      </b-row>
    </b-col>

    <b-col cols="3" class="d-none d-md-block"></b-col>
  </b-row>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style scoped>
.home-message {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
}
</style>