<template>
  <b-card no-body border-variant="0">
    <b-tabs pills card>
      <b-tab title="Places" no-body>
        <div class="alert" v-if="places.length === 0">
          Empty yet.
        </div>
        <info-card v-bind:key="place._id" v-for="place in places" :obj="place" v-on:destroy="destroy">
          <template v-slot:header>
            {{place.name}}
          </template>
        </info-card>
      </b-tab>

      <b-tab title="Factors" no-body>
        <div class="alert" v-if="factors.length === 0">
          Empty yet.
        </div>
        <info-card v-bind:key="factor._id" v-for="factor in factors" :obj="factor" v-on:destroy="destroy">
          <template v-slot:header>
            {{factor.name}}
          </template>
          <template v-slot:place>
            {{factor.description}}
          </template>
        </info-card>
      </b-tab>

    </b-tabs>
  </b-card>
</template>

<script>
import InfoCard from "../components/InfoCard";

export default {
  name: "Place",
  comments: {"info-card": InfoCard},
  data() {
    return {
      places: [],
      factors: [],
    };
  },
  methods: {
    destroy(obj) {

    },
  },
  created() {
    Promise.all([this.$api.getPlaces(), this.$api.getFactors()])
      .then(res => {
        const places = res[0].places;
        const factors = res[1].factors;
        places.forEach(place => this.places.push(place));
        factors.forEach(factor => this.factors.push(factor));
      });
  },
};
</script>

<style scoped>

</style>