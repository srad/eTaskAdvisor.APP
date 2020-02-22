<template>
  <b-row>
    <b-col>
      <b-card no-body border-variant="0" bg-variant="transparent" header-class="bg-light" body-class="p-0">
        <b-tabs pills card>
          <b-tab title="Activities" active no-body @click="view('activity')">
            <table class="d-none d-md-table text-sm table-sm table-hover table table-bordered">
              <thead class="bg-light">
              <th>Name</th>
              <th>Description</th>
              <th width="10%">Delete</th>
              </thead>
              <tbody>
              <tr :key="activity.activityId" v-for="activity in activities">
                <td>{{activity.name}}</td>
                <td>{{activity.description}}</td>
                <td>
                  <b-button variant="outline-danger" class="p-0" size="sm" block @click="destroy(activity)">Delete</b-button>
                </td>
              </tr>
              </tbody>
            </table>

            <info-card class="d-md-none mt-2" v-bind:key="activity.activityId" v-for="activity in activities" :obj="activity" v-on:destroy="destroy(activity)">
              <template v-slot:header>
                {{activity.name}}
              </template>
              <template v-slot:content>
                {{activity.description}}
              </template>
            </info-card>
          </b-tab>

          <b-tab title="Factors" no-body class=" border-0" @click="view('factor')">
            <table class="d-none d-md-table text-sm table-sm table-hover table table-bordered">
              <thead class="bg-light">
              <th width="20%">Name</th>
              <th>Description</th>
              <th width="10%">Delete</th>
              </thead>
              <tbody>
              <tr :key="factor.factorId" v-for="factor in factors">
                <td>{{factor.name}}</td>
                <td>{{factor.description}}</td>
                <td>
                  <b-button variant="outline-danger" size="sm" block @click="destroy(factor)">Delete</b-button>
                </td>
              </tr>
              </tbody>
            </table>
            <info-card class="d-md-none mt-2" v-bind:key="factor._id" v-for="factor in factors" :obj="factor" v-on:destroy="destroy(factor)">
              <template v-slot:header>
                {{factor.name}}
              </template>
              <template v-slot:content>
                {{factor.description}}
              </template>
            </info-card>
          </b-tab>
          <b-tab title="Affects" no-body @click="view('affect')">
            <b-form class="w-100 p-2 bg-light mb-2 d-none d-md-table">
              <label class="mr-sm-2 text-bold">Filter</label>
              <b-form-select style="width: 150px" class="mr-2" size="sm" v-model="filterActivity" :options="activityOptions"></b-form-select>
              <b-form-select style="width: 150px" class="mr-2" v-model="filterFactor" size="sm" :options="factorOptions"></b-form-select>
              <b-form-select style="width: 150px" v-model="filterInfluence" size="sm" :options="influenceOptions"></b-form-select>
              <b-button class="ml-2" variant="warning" size="sm" @click="resetFilters">Reset</b-button>
              <b-button class="ml-2" variant="outline-dark" size="sm" disabled>Count: {{filteredAffects.length}}</b-button>
            </b-form>

            <table class="d-none d-md-table text-sm table-sm table-hover table table-bordered">
              <thead class="bg-light">
              <th width="40%">Activity</th>
              <th width="40%">Is Affected By</th>
              <th width="10%">Influence</th>
              <th width="10%">Delete</th>
              </thead>
              <tbody v-if="filteredAffects.length === 0">
              <tr>
                <td colspan="4">Nothing found</td>
              </tr>
              </tbody>
              <tbody v-else v-for="affect in filteredAffects" :key="affect.affectId">
              <tr style="background: rgba(155,197,61,0.05)">
                <td>{{affect.activity.name}}</td>
                <td>{{affect.factor.name}}</td>
                <td>{{affect.influence.influenceDisplay}}</td>
                <td>
                  <b-button variant="outline-danger" class="p-0" size="sm" block @click="destroy(affect)">Delete</b-button>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  {{affect.description}}
                </td>
              </tr>
              <tr style="border-bottom: 2px double #9BC53D;">
                <td colspan="4">
                  <a href="affect.source" target="_blank">{{affect.source}}</a>
                </td>
              </tr>
              </tbody>
            </table>

            <info-card class="d-md-none info-card mt-2" v-bind:key="affect.affectId" deck v-for="affect in filteredAffects" :obj="affect" v-on:destroy="destroy(affect)">
              <template v-slot:header>{{affect.activity.name}}</template>
              <template v-slot:content>
                <span class="badge badge-light border-secondary border shadow-sm p-2 text-monospace">{{affect.activity.name}}</span>
                <span class="badge p-2 ml-1 text-monospace">is affected by</span>
                <span class="badge badge-info border-secondary border shadow-sm p-2 ml-1 text-monospace">{{affect.factor.name}}</span>
                <span class="badge p-2 ml-1 border-secondary border shadow-sm text-monospace"
                      v-bind:class="{'badge-success': affect.influenceName==='positive', 'badge-danger': affect.influenceName==='negative', 'badge-warning': affect.influenceName==='indifferent'}">{{affect.influence.influenceDisplay}}</span>
                <hr class="m-0 mb-2 mt-2"/>
                Source: <a class="text-info" :href="affect.source">{{affect.source}}</a>
              </template>
            </info-card>
          </b-tab>
        </b-tabs>
      </b-card>

      <b-modal id="addEntry" title="Add Entry" ok-only ok-variant="light" ok-title="Cancel">
        <b-card-text>
          <b-form @submit="onSubmit" @reset="onReset">
            <template v-if="type==='activity'">
              <b-form-group label="Name:">
                <b-form-input
                    v-model="form.activity.name"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Description:">
                <b-form-textarea
                    v-model="form.activity.description"
                    required
                ></b-form-textarea>
              </b-form-group>
            </template>

            <template v-if="type==='factor'">
              <b-form-group label="Name:">
                <b-form-input
                    v-model="form.factor.name"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Description:">
                <b-form-textarea v-model="form.factor.description" required/>
              </b-form-group>
            </template>

            <template v-if="type==='affect'">
              <b-form-group label="Activity">
                <b-form-select
                    v-model="form.affect.activityId"
                    :options="activityOptions"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="is affected by">
                <b-form-select
                    v-model="form.affect.factorId"
                    :options="factorOptions"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Influence">
                <b-form-select
                    v-model="form.affect.influenceName"
                    :options="influenceOptions"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Source">
                <b-form-input
                    v-model="form.affect.source"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Description">
                <b-form-textarea v-model="form.affect.description"/>
              </b-form-group>
            </template>

            <hr/>
            <b-btn-group align="right">
              <b-button type="submit" variant="primary">Save</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-btn-group>
          </b-form>
        </b-card-text>
      </b-modal>

      <app-nav :items="[{name: 'add_entry', label: 'Add Entry'}]" v-on:select="$bvModal.show('addEntry')"/>
    </b-col>
  </b-row>
</template>

<script>
import InfoCard from "../components/InfoCard";
import AppNav from "../components/AppNav";

export default {
  name: "Knowledge",
  components: {
    AppNav,
    "info-card": InfoCard,
  },
  data() {
    return {
      cache: {
        activities: [],
        affects: [],
        factors: [],
        influences: [],
      },

      filterActivity: "",
      filterFactor: "",
      filterInfluence: "",

      saved: true,

      type: "activity",
      display: "activity",

      types: [{value: "activity", text: "Activity"}, {value: "factor", text: "Factor"}, {value: "affect", text: "Affects"}],

      activities: [],
      affects: [],
      factors: [],
      influences: [],

      formValue: {},
      form: {
        activity: {
          activityId: "",
          name: "",
          description: "",
        },
        factor: {
          factorId: "",
          name: "",
          description: "",
        },
        affect: {
          affectId: "",
          activityId: "",
          factorId: "",
          influenceName: "",
          source: "",
          description: "",
        },
        checked: [],
      },
      show: true,
    };
  },
  computed: {
    activityOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.activities.map(activity => ({value: activity.activityId, text: activity.name})));
    },
    factorOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.factors.map(factor => ({value: factor.factorId, text: factor.name})));
    },
    influenceOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.influences.map(influence => ({value: influence.influenceName, text: influence.influenceDisplay})));
    },
    filteredAffects() {
      let result = this.cache.affects;

      if (this.filterActivity !== "") {
        result = result.filter(affect => affect.activityId === this.filterActivity);
      }
      if (this.filterFactor !== "") {
        result = result.filter(affect => affect.factorId === this.filterFactor);
      }
      if (this.filterInfluence !== "") {
        result = result.filter(affect => affect.influenceName === this.filterInfluence);
      }

      return result;
    },
  },
  watch: {
    type() {
      this.clear();
    },
    /*
    filterActivity(val) {
      while (this.activities.length > 0) {
        this.activities.pop();
      }
    },
    filterFactor(val) {
      this.factors = this.query.factors.filter(f => f.factorId === val);
    },
     */
  },
  methods: {
    view(tab) {
      this.display = tab;
      this.type = tab;
    },
    resetFilters() {
      this.filterInfluence = "";
      this.filterActivity = "";
      this.filterFactor = "";
    },
    destroy(option) {
      if (window.confirm("Delete?")) {
        switch(this.display) {
        case "activity":
          this.$api.deleteActivity(option.activityId)
            .then(() => {
              this.activities.splice(this.activities.indexOf(option), 1);
            });
          break;
        case "factor":
          this.$api.deleteFactor(option.factorId)
            .then(() => {
              this.factors.splice(this.factors.indexOf(option), 1);
            });
          break;
        case "affect":
          this.$api.deleteAffect(option.affectId)
            .then(() => {
              this.affects.splice(this.affects.indexOf(option), 1);
            });
          break;
        }
      }
    },
    onSubmit(evt) {
      evt.preventDefault();

      const done = () => {
        this.clear();
        this.saved = true;
        this.$bvModal.hide("addEntry");
        setTimeout(() => this.saved = false, 2000);
      };

      const data = this.getForm();

      switch(this.type) {
      case "activity":
        data.activityId = 0;
        this.$api.addActivity(data)
          .then(res => {
            this.activities.unshift(res);
            this.cache.activities.unshift(res);
            done();
          });
        break;
      case "factor":
        data.factorId = 0;
        this.$api.addFactor(data)
          .then(res => {
            this.factors.unshift(res);
            this.cache.factors.unshift(res);
            done();
          });
        break;
      case "affect":
        data.affectId = 0;
        this.$api.addAffect(data)
          .then(res => {
            this.affects.unshift(res);
            this.cache.affects.unshift(res);
            done();
          });
        break;
      }
    },
    getForm() {
      return this.form[this.type];
    },
    clear() {
      const form = this.form[this.type];
      Object.keys(form)
        .forEach(key => {
          form[key] = "";
        });
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onReset(evt) {
      evt.preventDefault();
      this.clear();
    },
  },
  created() {
    Promise.all([this.$api.getActivities(), this.$api.getFactors(), this.$api.getAffects(), this.$api.getInfluences()])
      .then(res => {
        const activities = res[0];
        const factors = res[1];
        const affects = res[2];
        const influences = res[3];

        activities.forEach(activity => {
          this.activities.push(activity);
          this.cache.activities.push(activity);
        });
        factors.forEach(factor => {
          this.factors.push(factor);
          this.cache.factors.push(factor);
        });
        affects.forEach(affect => {
          this.affects.push(affect);
          this.cache.affects.push(affect);
        });
        influences.forEach(influence => {
          this.influences.push(influence);
          this.cache.influences.push(influence);
        });
      });
  },
};
</script>

<style scoped>
</style>