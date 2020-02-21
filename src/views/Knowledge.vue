<template>
  <b-card no-body border-variant="0">
    <b-tabs pills card>
      <b-tab title="Activities" active no-body @click="display='activity'">
        <info-card v-bind:key="activity._id" v-for="activity in query.activities" :obj="activity" v-on:destroy="destroy(activity)">
          <template v-slot:header>
            {{activity.name}}
          </template>
          <template v-slot:content>
            {{activity.description}}
          </template>
        </info-card>
      </b-tab>
      <b-tab title="Factors" no-body class="bg-light border-0" @click="display='factor'">
        <info-card v-bind:key="factor._id" v-for="factor in query.factors" :obj="factor" v-on:destroy="destroy(factor)">
          <template v-slot:header>
            {{factor.name}}
          </template>
          <template v-slot:content>
            {{factor.description}}
          </template>
        </info-card>
      </b-tab>
      <b-tab title="Impacts" no-body @click="display='impact'">
        <b-form inline class="p-2 bg-light mb-2">
          <label class="mr-sm-2 text-bold">Filter</label>
          <b-form-select class="mr-2" v-model="filterActivity" :options="[''].concat(activityOptions)"></b-form-select>
          <b-form-select v-model="filterFactor" :options="[''].concat(factorOptions)"></b-form-select>
        </b-form>

        <info-card v-bind:key="impact._id" deck v-for="impact in query.impacts" :obj="impact" v-on:destroy="destroy(impact)">
          <template v-slot:header>
            {{impact.activity[0].name}}
            <span class="badge text-capitalize text-right float-right" v-bind:class="{'badge-success': impact.influence==='positive', 'badge-danger': impact.influence==='negative', 'badge-warning': impact.influence==='indifferent'}">{{impact.influence}}</span>
          </template>
          <template v-slot:content>
            <span class="badge badge-warning pl-1 pr-1">{{impact.activity[0].name}}</span> is affected by
            <span class="badge badge-info pl-1 pr-1">{{impact.factor[0].name}}</span>
            <span class="badge ml-3" v-bind:class="{'badge-success': impact.influence==='positive', 'badge-danger': impact.influence==='negative', 'badge-warning': impact.influence==='indifferent'}">{{impact.influence}}</span>
            <br/>
            Source: <a class="text-info" :href="impact.source">{{impact.source}}</a>
          </template>
        </info-card>
      </b-tab>
      <b-tab title="Node">
        <node-editor/>
      </b-tab>
      <b-tab title="Add">
        <b-alert variant="success" v-if="saved">
          Saved!
        </b-alert>
        <b-form-select
            id="input-3"
            v-model="type"
            :options="types"
            required
        ></b-form-select>
        <hr/>
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
                <b-form-textarea
                    v-model="form.factor.description"
                    required
                ></b-form-textarea>
              </b-form-group>
            </template>

            <template v-if="type==='impact'">
              <b-form-group label="Activity">
                <b-form-select
                    v-model="form.impact.activity"
                    :options="activityOptions"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="is affected by">
                <b-form-select
                    v-model="form.impact.factor"
                    :options="factorOptions"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Influence">
                <b-form-select
                    v-model="form.impact.influence"
                    :options="influences"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Source">
                <b-form-input
                    v-model="form.impact.source"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>
            </template>

            <hr/>
            <b-btn-group align="right">
              <b-button type="submit" variant="primary">Save</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-btn-group>
          </b-form>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import InfoCard from "../components/InfoCard";
import NodeEditor from "../components/NodeEditor";

export default {
  name: "Knowledge",
  components: {
    "info-card": InfoCard,
    "node-editor": NodeEditor,
  },
  data() {
    return {
      query: {
        activities: [],
        impacts: [],
        factors: [],
      },
      influences: [
        {value: "positive", text: "Positively"},
        {value: "negative", text: "Negatively"},
        {value: "indifferent", text: "Indifferent"},
        {value: "unclear", text: "Unclear"},
      ],
      filterActivity: "",
      filterFactor: "",
      saved: true,
      type: "activity",
      display: "activity",
      types: [{value: "activity", text: "Activity"}, {value: "factor", text: "Factor"}, {value: "impact", text: "Impact"}],
      activities: [],
      impacts: [],
      factors: [],
      formValue: {},
      form: {
        activity: {
          id: "",
          name: "",
          description: "",
        },
        factor: {
          id: "",
          name: "",
          description: "",
        },
        impact: {
          id: "",
          activity: "",
          factor: "",
          influence: "",
          source: "",
        },
        email: "",
        name: "",
        food: null,
        checked: [],
      },
      foods: [{text: "Select One", value: null}, "Carrots", "Beans", "Tomatoes", "Corn"],
      show: true,
    };
  },
  computed: {
    activityOptions() {
      return this.query.activities.map(activity => ({value: activity._id, text: activity.name}));
    },
    factorOptions() {
      return this.query.factors.map(factor => ({value: factor._id, text: factor.name}));
    },
  },
  watch: {
    type() {
      this.clear();
    },
    filterActivity(val) {
      this.impacts.forEach(i => i.$show = i.activity._id === val);
    },
    filterFactor(val) {
      this.impacts.forEach(i => i.$show = i.factor._id === val);
    },
  },
  methods: {
    destroy(option) {
      if (window.confirm("Delete?")) {
        switch (this.display) {
        case "activity":
          this.$api.deleteActivity(option._id)
            .then(() => {
              this.query.activities.splice(this.activities.indexOf(option), 1);
            });
          break;
        case "factor":
          this.$api.deleteFactor(option._id)
            .then(() => {
              this.query.factors.splice(this.factors.indexOf(option), 1);
            });
          break;
        case "impact":
          this.$api.deleteImpact(option._id)
            .then(() => {
              this.query.impacts.splice(this.activities.indexOf(option), 1);
            });
          break;
        }
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      switch (this.type) {
      case "activity":
        this.$api.addActivity(this.getForm())
          .then(res => {
            this.query.activities.push(res.addActivity);
            this.clear();
            this.saved = true;
            setTimeout(() => this.saved = false, 2000);
          });
        break;
      case "factor":
        this.$api.addFactor(this.getForm())
          .then(res => {
            this.query.factors.push(res.addFactor);
            this.clear();
            this.saved = true;
            setTimeout(() => this.saved = false, 2000);
          });
        break;
      case "impact":
        this.$api.addImpact(this.getForm())
          .then(res => {
            this.query.impacts.push(res.addImpact);
            this.clear();
            this.saved = true;
            setTimeout(() => this.saved = false, 2000);
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
    Promise.all([this.$api.getActivities(), this.$api.getFactors(), this.$api.getImpacts()])
      .then(res => {
        const activities = res[0].activities;
        const factors = res[1].factors;
        const impacts = res[2].impacts;

        activities.forEach(activity => {
          this.query.activities.push(activity);
        });

        factors.forEach(factor => {
          this.query.factors.push(factor);
        });

        impacts.forEach(impact => {
          impact.$show = true;
          this.query.impacts.push(impact);
        });
      });
  },
};
</script>

<style scoped>

</style>