<template>
  <b-row>
    <b-col class="text-center" v-if="activities.length > 0">

      <b-card header-bg-variant="light" header-class="bg-light" border-variant="light" class="text-left mb-3 text-dark bg-primary shadow-sm" title="Choose Learning Activity">
        <b-card-text>
          <b-form-select :options="optionsActivities" class="shadow-sm bg-primary border-dark text-dark" v-model="selectedActivity"/>
        </b-card-text>
      </b-card>

      <b-card header-bg-variant="light" class="text-left text-dark bg-primary shadow-sm border mb-3 border-light" v-if="showSelection" :title="info.name">
        <b-card-text>
          <h6><span class="font-weight-bolder">Details:</span> {{activity.description}}</h6>
          <router-link class="btn btn-dark float-right shadow-sm" :to="{ name: 'Tasks', params: { activityId: activity.activityId }}">
            Add as Task
          </router-link>
        </b-card-text>
      </b-card>

      <b-card header-bg-variant="light" class="text-left text-dark bg-primary shadow-sm border border-light" v-if="showSelection" title="Factors">
        <b-card-text>
          <table class="w-100 table table-sm m-0 table-borderless">
            <tbody>
            <tr v-for="affect in affects" :key="affect.affectId">
              <td class="p-0 pb-1">
                <b-button class="text-left" block size="sm" variant="dark" @click="select(affect.factor)">{{affect.factor.name}}</b-button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-card-text>
      </b-card>

    </b-col>

    <b-modal id="factorInfo" title="Factor Info" ok-only header-bg-variant="primary">
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
      activity: "",
      info: "",
      affects: [],
      activities: [],
      optionsActivities: [],
      showSelection: false,
    };
  },
  watch: {
    selectedActivity(activityId) {
      this.$api.getActivityAffectedBy({activityId})
        .then(res => this.affects = res);
      const a = this.activities.filter(a => a.activityId === activityId)[0];
      this.activity = a;
      this.showSelection = true;
    },
  },
  methods: {
    select(factor) {
      this.selectedFactor = factor;
      this.$bvModal.show("factorInfo");
    },
  },
  created() {
    this.$api.getActivities()
      .then(res => res.forEach(a => {
        this.activities.push(a);
        this.optionsActivities.push({value: a.activityId, text: a.name});
      }));
  },
};
</script>

<style>
</style>