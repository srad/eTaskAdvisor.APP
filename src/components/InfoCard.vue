<template>
  <div>
    <b-card class="mb-2 shadow-sm" border-variant="secondary" header-tag="header" footer-tag="footer" header-bg-variant="secondary" header-class="text-white p-2" footer-class="p-1 text-right">
      <template v-slot:header>
        <h6 class="mb-0">
          <slot name="header"></slot>
        </h6>
      </template>
      <b-card-text>
        <slot name="content"></slot>
      </b-card-text>
      <template v-slot:footer>
        <b-button @click="$emit('destroy', myObj)" size="sm" variant="danger">Delete</b-button>
      </template>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    obj: Object,
  },
  name: "InfoCard",
  data() {
    return {
      myObj: this.obj,
    };
  },
};
</script>

<style scoped>

</style>