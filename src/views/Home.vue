<template>
  <b-row align-v="center">
    <b-col>

      <b-row>
        <b-col class="text-center">
          <h1>Welcome to</h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <font-awesome-icon icon="hands-helping" size="5x" class="mt-3 mb-3"/>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-center">
          <h1>eTaskAdvisor</h1>
          <h4 class="m-4">
            This app will help you to improve your learning process with the latest knowledge from research
          </h4>
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

<style scoped>
</style>