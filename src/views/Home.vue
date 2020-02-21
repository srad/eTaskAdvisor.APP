<template>
  <b-row align-v="center" style="height: 100vh" class="home bg-primary text-white">
    <b-col>

      <template v-if="!start">
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
            <h4 class="m-4 text-dark">
              This app will help you to improve your learning process with the latest knowledge from research
            </h4>
            <br/>
            <b-button variant="outline-light" size="lg" class="w-75" @click="start=true">start</b-button>
          </b-col>
        </b-row>
      </template>

      <b-row v-if="start">
        <b-col class="text-center" v-if="selection.length > 0">
          <h4 class="text-dark">
            What type of learning task are you doing?
          </h4>
          <br/>
          <b-button :key="s" v-for="s in selection" variant="outline-light" size="lg" class="w-75 mt-2 text-capitalize" @click="select(s)">{{s}}</b-button>
        </b-col>
        <b-col v-else class="text-center">
          You selection: {{this.path}}
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      start: false,
      path: [],
      step: "start",
      selection: [],
      tree: {
        "start": {
          "reading": {},
          "writing": {},
          "memorization": {},
          "verbal": {},
          "creativity": {},
        },
      },
    };
  },
  watch: {
    path(val) {
      console.log(val);
    },
  },
  methods: {
    select(step) {
      this.path.push(step);
      this.tree = this.tree[step];
      this.selection = Object.keys(this.tree);
    },
  },
  created() {
    // root
    this.tree = this.tree[this.step];
    this.selection = Object.keys(this.tree);
  },
};
</script>

<style scoped>
.home {
  margin-top: -3rem;
}
</style>