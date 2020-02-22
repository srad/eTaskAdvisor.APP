<template>
  <div>
    <b-card class="mb-2 shadow-sm" border-variant="secondary" header-tag="header" footer-tag="footer" header-bg-variant="secondary" body-class="p-2" header-class="text-white p-1 align-middle" footer-class="p-1 text-right">
      <template v-slot:header>
        <h6 class="float-left m-0 p-1">
          <slot name="header"></slot>
        </h6>
        <b-button class="float-right m-0 shadow-sm" @click="$emit('destroy', myObj)" size="sm" variant="danger">Delete</b-button>
      </template>
      <b-card-text>
        <slot name="content"></slot>
      </b-card-text>
      <b-card-footer v-if="$slots['footer']" footer-class="p-1" footer-bg-variant="transparent">
        <slot name="footer"/>
      </b-card-footer>
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