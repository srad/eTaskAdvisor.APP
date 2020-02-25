<template>
  <b-row>
    <b-col class="home-message pt-4 pb-4 m-2 mx-auto border border-light shadow-sm" style="max-width: 330px;">
      <b-row>
        <b-col class="text-center">
          <h4>Welcome to</h4>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <font-awesome-icon icon="hands-helping" size="3x" class="mt-3 mb-3"/>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <h4>eTaskAdvisor</h4>
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

<style scoped lang="scss">
.home-message {
  background: rgba(74, 67, 76, 0.85);
  border-radius: 3px;
}
</style>