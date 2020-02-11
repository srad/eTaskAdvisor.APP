<template>
  <b-card no-body border-variant="0">
    <b-tabs pills card>
      <b-tab title="Activities" active no-body @click="display='task'">
        <info-card v-bind:key="task._id" v-for="task in query.tasks" :obj="task" v-on:destroy="destroy(task)">
          <template v-slot:header>
            {{task.name}}
          </template>
          <template v-slot:content>
            {{task.description}}
          </template>
        </info-card>
      </b-tab>
      <b-tab title="Factors" no-body class="p-2" @click="display='factor'">
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
        <info-card v-bind:key="impact._id" deck v-for="impact in query.impacts" :obj="impact" v-on:destroy="destroy(impact)">
          <template v-slot:header>
            {{impact.task[0].name}}
            <span class="badge text-capitalize text-right float-right" v-bind:class="{'badge-success': impact.influence==='positive', 'badge-danger': impact.influence==='negative', 'badge-warning': impact.influence==='indifferent'}">{{impact.influence}}</span>
          </template>
          <template v-slot:content>
            <span class="badge badge-warning pl-1 pr-1">{{impact.task[0].name}}</span> is affected by
            <span class="badge badge-info pl-1 pr-1">{{impact.factor[0].name}}</span>
            <span class="badge ml-3" v-bind:class="{'badge-success': impact.influence==='positive', 'badge-danger': impact.influence==='negative', 'badge-warning': impact.influence==='indifferent'}">{{impact.influence}}</span>
            <br/>
            Source: <a class="text-info" :href="impact.source">{{impact.source}}</a>
          </template>
        </info-card>
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
            <template v-if="type==='task'">
              <b-form-group label="Name:">
                <b-form-input
                    v-model="form.task.name"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Description:">
                <b-form-textarea
                    v-model="form.task.description"
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
                    v-model="form.impact.task"
                    :options="taskOptions"
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

export default {
  name: "Knowledge",
  components: {
    "info-card": InfoCard,
  },
  data() {
    return {
      query: {
        tasks: [],
        impacts: [],
        factors: [],
      },
      influences: [
        {value: "positive", text: "Positively"},
        {value: "negative", text: "Negatively"},
        {value: "indifferent", text: "Indifferent"},
        {value: "unclear", text: "Unclear"},
      ],
      saved: true,
      type: "task",
      display: "task",
      types: [{value: "task", text: "Activity"}, {value: "factor", text: "Factor"}, {value: "impact", text: "Impact"}],
      tasks: [],
      impacts: [],
      factors: [],
      formValue: {},
      form: {
        task: {
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
          task: "",
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
    taskOptions() {
      return this.query.tasks.map(task => ({value: task._id, text: task.name}));
    },
    factorOptions() {
      return this.query.factors.map(factor => ({value: factor._id, text: factor.name}));
    },
  },
  watch: {
    type() {
      this.clear();
    },
  },
  methods: {
    destroy(option) {
      if (window.confirm("Delete?")) {
        switch (this.display) {
        case "task":
          this.$api.deleteTask(option._id)
            .then(() => {
              this.query.tasks.splice(this.tasks.indexOf(option), 1);
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
              this.query.impacts.splice(this.tasks.indexOf(option), 1);
            });
          break;
        }
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      switch (this.type) {
      case "task":
        this.$api.addTask(this.getForm())
          .then(res => {
            this.query.tasks.push(res.addTask);
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
    Promise.all([this.$api.getTasks(), this.$api.getFactors(), this.$api.getImpacts()])
      .then(res => {
        const tasks = res[0].tasks;
        const factors = res[1].factors;
        const impacts = res[2].impacts;

        tasks.forEach(task => {
          this.query.tasks.push(task);
        });

        factors.forEach(factor => {
          this.query.factors.push(factor);
        });

        impacts.forEach(impact => {
          this.query.impacts.push(impact);
        });
      });
  },
};
</script>

<style scoped>

</style>