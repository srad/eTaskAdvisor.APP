<template>
  <div class="iframe">
    <iframe ref="frame" class="border-0 w-100 vh-100" :src="src"></iframe>
  </div>
</template>

<script>
export default {
  name: "Iframe",
  props: {
    url: String,
  },
  data() {
    return {
      src: this.url,
    };
  },
  mounted() {
    this.$refs.frame.contentWindow.document.body.style.color = "white";
  },
};
</script>

<style scoped>
</style>