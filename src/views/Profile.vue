<template>
  <b-row>
    <b-col>
      <div class="text-center" v-if="loading">
        <b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Loading"/>
      </div>
      <div v-else>
        <h5>
          <p>Your username is
          <b-badge variant="info">{{username}}</b-badge></p>
          <hr/>
          <p>Devices registered on our server.</p>
        </h5>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Profile",
  components: {},
  data() {
    return {
      loading: true,
      username: localStorage.username,
    };
  },
  mounted() {
    this.loading = false;
  }
};
</script>

<style scoped>

</style>