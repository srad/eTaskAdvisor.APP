<template>
  <b-card no-body border-variant="0">
    <b-tabs pills card>

      <b-tab title="Plans" active no-body>
        <div class="alert" v-if="plans.length === 0">
          Empty yet.
        </div>
        <info-card v-bind:key="plan._id" v-for="plan in plans" :obj="place" v-on:destroy="destroy(plan)">
          <template v-slot:header>
            ---------
          </template>
        </info-card>
      </b-tab>

      <b-tab title="Places" no-body>
        <div class="alert" v-if="places.length === 0">
          Empty yet.
        </div>
        <info-card v-bind:key="place._id" v-for="place in places" :obj="place" v-on:destroy="destroy(place)">
          <template v-slot:header>
            {{place.name}}
          </template>
        </info-card>
      </b-tab>

      <b-tab title="Properties" no-body>
        <div class="alert" v-if="properties.length === 0">
          Empty yet.
        </div>
        <info-card v-bind:key="property._id" v-for="property in properties" :obj="property" v-on:destroy="destroy(property)">
          <template v-slot:header>
            {{property.name}}
          </template>
        </info-card>
      </b-tab>

    </b-tabs>
  </b-card>
</template>

<script>
export default {
  name: "Planner",
  data() {
    return {
      places: [],
      plans: [],
      properties: [],
    };
  },
  methods: {
    destroy(obj) {

    },
  },
  created() {
    Promise.all([this.$api.getPlaces(), this.$api.getPlans()])
      .then(res => {
        this.places = res[0].places;
        this.plans = res[1].plans;
      });
  },
};
</script>

<style scoped>

</style>