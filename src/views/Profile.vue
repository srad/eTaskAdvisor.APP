<template>
  <div>
    <b-row>
      <b-col>
        <div class="text-center" v-if="loading">
          <b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Loading"/>
        </div>
        <div v-else hidden>
          <h5>
            <p>Your username is
              <b-badge variant="info">{{username}}</b-badge>
            </p>
            <hr/>
          </h5>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!loading">
      <b-col>
        <b-alert show>
          <b-row>
            <b-col>This device is anonymously registered on our server.</b-col>
            <b-col cols="4" class="text-right">
              <font-awesome-icon icon="user-secret" size="3x" class="text-dark"/>
            </b-col>
          </b-row>
        </b-alert>
      </b-col>
    </b-row>
  </div>
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
  },
};
</script>

<style scoped>

</style>