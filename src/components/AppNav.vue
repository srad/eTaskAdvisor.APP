<template>
  <footer class="app-nav p-2 align-middle position-fixed bg-primary border-top border-primary shadow-sm" style="height: 3.5rem; left: 0; bottom: 0; right: 0;">
    <div class="text-right h-100">
      <b-button :key="item.name" v-for="item in instanceItems" variant="dark" class="h-100 ml-2" @click="$emit('select', item.name)">{{item.label}}</b-button>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppNav",
  props: {
    items: Array,
  },
  data() {
    return {
      instanceItems: this.items,
    };
  },
};
</script>

<style scoped>
.app-nav {
  z-index: 1000;
}
</style>