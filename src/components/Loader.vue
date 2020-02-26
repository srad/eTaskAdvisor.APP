<template>
  <div class="text-center" v-if="loading">
    <b-spinner style="width: 3rem; height: 3rem;" variant="primary" :label="label || 'Loading'"/>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    label: String,
    loading: Boolean,
  },
};
</script>

<style scoped>

</style>