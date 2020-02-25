<template>
  <div class="imprint">
    <iframe class="border-0 w-100 vh-100" :src="src"></iframe>
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
};
</script>

<style scoped>
.imprint h1 {
  font-size: 160%;
}

.imprint h2 {
  font-size: 140%;
}

.imprint h3 {
  font-size: 120%;
}
</style>