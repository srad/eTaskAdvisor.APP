<template>
  <div>
    <b-card class="mb-2 text-left text-dark mb-2 shadow-sm"
            border-variant="primary"
            header-bg-variant="primary"
            body-class="p-0 bg-dark text-white"
            header-class="p-1">

      <template v-slot:header>
        <h6 class="float-left m-0 p-1">
          <slot name="header"></slot>
        </h6>
        <b-button v-if="!instanceHideDelete" variant="danger" class="float-right shadow-sm text-sm pl-3 pr-3" style="padding: 0.1rem" @click="$emit('destroy', obj)">
          Delete
          <!--<font-awesome-icon icon="trash-alt"/>-->
        </b-button>
      </template>

      <b-card-text class="p-2">
        <slot name="content"></slot>
      </b-card-text>

      <b-card-footer v-if="$slots['footer']" :footer-class="'p-0 ' + instanceFooterClass" footer-bg-variant="dark">
        <div class="w-100 p-1" style="display: table">
          <slot name="footer"/>
        </div>
      </b-card-footer>

    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    obj: Object,
    footerClass: String,
    hideDelete: Boolean,
  },
  name: "InfoCard",
  data() {
    return {
      myObj: this.obj,
      instanceFooterClass: this.footerClass || "",
      instanceHideDelete: this.hideDelete || false,
    };
  },
};
</script>

<style scoped>

</style>