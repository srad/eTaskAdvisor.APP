<template>
  <div class="about">
    <p class="p-3 border-light shadow-sm border bg-dark">The purpose of this application is to gather research on the influence of environmental
      effect on learning activities and making them easily accessible.</p>
    <hr class="border-dark"/>
    <b-alert variant="warning" show>
      <b-row>
        <b-col>This device is anonymously registered on our server.</b-col>
        <b-col cols="4" class="text-right">
          <font-awesome-icon icon="user-secret" size="3x" class="text-dark"/>
        </b-col>
      </b-row>
    </b-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>