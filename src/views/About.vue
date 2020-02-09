<template>
  <div class="about">
    <p>Mobile PWA ....</p>
    <hr/>
    <h3>Used frameworks and libs</h3>
    <ol>
      <li v-for="[link, label] in links" :key="link">
        <a :href="link" v-text="label" target="_blank"></a>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        ["https://vuejs.org/", "Vue.js"],
        ["https://bootstrap-vue.js.org/", "BootstrapVue"],
        ["https://vuex.vuejs.org/", "Vuex"],
        ["https://expressjs.com/", "Express"],
        ["https://fontawesome.com/", "Font Awesome"],
        ["https://github.com/axios/axios", "axios"],
        ["https://www.chaijs.com/", "Chai"],
      ],
    };
  },
};
</script>