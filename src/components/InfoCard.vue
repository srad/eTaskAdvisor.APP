<template>
  <div>
    <b-card class="mb-2 text-left text-dark shadow-sm border mb-2 border-secondary" header-tag="header" footer-tag="footer" header-bg-variant="secondary" body-class="p-0" header-class="p-1 text-white">
      <template v-slot:header>
        <h6 class="float-left m-0 p-1">
          <slot name="header"></slot>
        </h6>
        <b-button class="float-right m-0 shadow-sm" @click="$emit('destroy', myObj)" size="sm" variant="danger">Delete</b-button>
      </template>
      <b-card-text class="p-2">
        <slot name="content"></slot>
      </b-card-text>
      <b-card-footer v-if="$slots['footer']" :footer-class="'p-1 ' + instanceFooterClass" style="display: flex;" footer-bg-variant="light">
        <slot name="footer"/>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    obj: Object,
    footerClass: String,
  },
  name: "InfoCard",
  data() {
    return {
      myObj: this.obj,
      instanceFooterClass: this.footerClass || "",
    };
  },
};
</script>

<style scoped>

</style>