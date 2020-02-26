<template>
  <div>
    <div id="googleLogin" class="float-left"></div>
    <b-button class="float-right" style="background: #4285f4" size="md" @click="signOut">Sign Out</b-button>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {};
  },
  methods: {
    signOut() {
      this.auth2.signOut();
    },
  },
  mounted() {
    window.gapi.load("auth2,signin2", () => {
      window.gapi.signin2.render("googleLogin", {
        "scope": "profile email",
        "longtitle": true,
        "theme": "dark",
      });

      window.gapi.auth2.init();

      const auth2 = window.gapi.auth2.getAuthInstance();
      this.auth2 = auth2;

      auth2.isSignedIn.listen((signedIn) => {
        this.$log("signIn", signedIn);
      });
      auth2.currentUser.listen((user) => {
        this.$log("currentUser", user);
        if (user.isSignedIn()) {
          this.$log(user.BasicProfile());
          //  console.log(auth2.signIn());
        }
      });
    });
  },
};
</script>

<style scoped>

</style>