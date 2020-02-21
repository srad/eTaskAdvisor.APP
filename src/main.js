import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import {BootstrapVue} from "bootstrap-vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHeart, faPortrait, faHandsHelping, faUserSecret, faAward, faGraduationCap, faStar, faBrain, faSchool, faUniversity, faCheck, faRobot, faTimes, faMedal, faLaughBeam, faHeartBroken, faTrophy, faStopwatch, faDice, faQuestion, faSkullCrossbones} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {Api} from "./services/api";

Vue.use(BootstrapVue);

library.add(faHeart, faAward, faPortrait, faHandsHelping, faUserSecret, faGraduationCap, faBrain, faSchool, faUniversity, faStar, faCheck, faRobot, faTimes, faMedal, faLaughBeam, faHeartBroken, faTrophy, faStopwatch, faDice, faQuestion, faSkullCrossbones);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$log = function (...args) {
  console.log(...args);
};

const api = new Api();
Vue.prototype.$api = api;

api.authenticate()
  .then(() => {
    console.info("Authenticated");
  })
  .catch(error => {
    console.error(`Token could not be requested:${error}`);
  });

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
