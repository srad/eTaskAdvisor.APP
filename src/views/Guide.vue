<template>
  <b-row>
    <b-col class="text-center" v-if="aspects.length > 0">

      <b-card title="Choose Learning Activity" body-bg-variant="primary" header-class="bg-light" border-variant="dark" class="text-left mb-3 text-dark shadow-sm">
        <b-card-text>
          <b-form-select :options="optionsActivities" class="shadow-sm bg-primary border-dark text-dark" v-model="selectedActivity"/>
        </b-card-text>
      </b-card>

      <b-card v-if="showSelection" :title="info.name" class="text-left text-dark shadow-sm mb-3" body-bg-variant="primary" border-variant="dark">
        <b-card-text>
          <h6><span class="font-weight-bolder">Details:</span> {{aspect.description}}</h6>
          <router-link class="btn btn-dark float-right shadow-sm" :to="{ name: 'Tasks', params: { aspectId: aspect.aspectId }}">
            Add as Task
          </router-link>
        </b-card-text>
      </b-card>

      <b-card v-if="showSelection" title="This activity is affected by" body-bg-variant="primary" border-variant="dark" class="text-left text-dark shadow-sm">
        <b-card-text>
          <hr class="border-dark"/>
          <table class="w-100 table table-sm m-0 table-borderless">
            <tbody>
            <tr v-if="affects.length===0">
              <td>No results found</td>
            </tr>
            <tr v-else v-for="affect in affects" :key="affect.affectId">
              <td class="p-0 pb-1">
                <b-button block class="float-right" variant="dark" @click="select(affect.factor)">{{affect.factor.name}}</b-button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-card-text>
      </b-card>

    </b-col>

    <b-modal id="factorInfo" title="Factor Info" ok-only header-bg-variant="primary" header-class="text-dark" body-bg-variant="dark" footer-bg-variant="dark" header-border-variant="primary" footer-border-variant="primary">
      <h5>{{selectedFactor.name}}</h5>
      <p>{{selectedFactor.description}}</p>
    </b-modal>
  </b-row>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      selectedFactor: {name: "", description: ""},
      selectedActivity: "",
      aspect: "",
      info: "",
      affects: [],
      aspects: [],
      activities: [],
      learning: [],
      showSelection: false,
    };
  },
  watch: {
    selectedActivity(aspectId) {
      this.$api.aspects.getAspectAffectedBy({aspectId: aspectId})
        .then(res => this.affects = res);
      const a = this.aspects.filter(a => a.aspectId === aspectId)[0];
      this.aspect = a;
      this.showSelection = true;
    },
  },
  computed: {
    optionsActivities() {
      return this.aspects
        .filter(a => a.aspectType.value === "activity")
        .map(a => ({value: a.aspectId, text: a.name}));
    },
    optionsLearning() {
      return this.aspects
        .filter(a => a.aspectType.value === "learning")
        .map(a => ({value: a.aspectId, text: a.name}));
    },
  },
  methods: {
    select(factor) {
      this.selectedFactor = factor;
      this.$bvModal.show("factorInfo");
    },
  },
  created() {
    this.$api.aspects.toList()
      .then(res => res.forEach(a =>  this.aspects.push(a)));
  },
};
</script>

<style>
</style>