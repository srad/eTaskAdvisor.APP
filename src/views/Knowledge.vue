<template>
  <b-card no-body>
    <b-tabs pills card>
      <b-tab title="Tasks" active no-body>
        <b-card-text>
          <table class="table m-0">
            <thead class="bg-light">
            <th>Name</th>
            <th width="20%">Delete</th>
            </thead>
            <tbody>
            <tr v-bind:key="task.value" v-for="task in tasks">
              <td>{{task.text}}</td>
              <td>
                <b-button size="sm" block variant="danger">x</b-button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="Factors" no-body>
        <table class="table m-0">
          <thead class="bg-light">
          <th>Name</th>
          <th width="20%">Delete</th>
          </thead>
          <tbody>
          <tr v-bind:key="factor.value" v-for="factor in factors">
            <td>{{factor.text}}</td>
            <td>
              <b-button size="sm" block variant="danger">x</b-button>
            </td>
          </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab title="Impacts" no-body>
        <table class="table m-0">
          <thead class="bg-light">
          <th>Name</th>
          <th width="20%">Delete</th>
          </thead>
          <tbody>
          <tr v-bind:key="impact.value" v-for="impact in impacts">
            <td>{{impact.text}}</td>
            <td>
              <b-button size="sm" block variant="danger">x</b-button>
            </td>
          </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab title="Add">
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
              <b-form-group label="Task:">
                <b-form-select
                    v-model="form.impact.task"
                    :options="tasks"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Factor:">
                <b-form-select
                    v-model="form.impact.factor"
                    :options="factors"
                    required
                ></b-form-select>
              </b-form-group>

              <b-form-group label="Change:">
                <b-form-input
                    v-model="form.impact.change"
                    type="number"
                    required
                    placeholder="0"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Unit:">
                <b-form-input
                    v-model="form.impact.unit"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Source:">
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
          <b-card hidden class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
          </b-card>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  name: "Knowledge",
  data() {
    return {
      type: "task",
      types: [{value: "task", text: "Task"}, {value: "factor", text: "Factor"}, {value: "impact", text: "Impact"}],
      tasks: [{value: "v1", text: "T1"}],
      impacts: [{value: "v1", text: "v1->v2"}],
      factors: [{value: "v1", text: "T1"}],
      formValue: {},
      form: {
        task: {
          id: "",
          name: "",
          description: ""
        },
        factor: {
          id: "",
          name: "",
          description: ""
        },
        impact: {
          id: "",
          task: "",
          factor: "",
          change: 0,
          unit: "",
          source: ""
        },
        email: "",
        name: "",
        food: null,
        checked: []
      },
      foods: [{text: "Select One", value: null}, "Carrots", "Beans", "Tomatoes", "Corn"],
      show: true
    };
  },
  watch: {
    type() {
      this.clear();
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      console.log(this.form[this.type]);
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
    }
  },
  mounted() {
    Promise.all([this.$api.getTasks()])
      .then(results => {
        console.log(results);
      });
  }
};
</script>

<style scoped>

</style>