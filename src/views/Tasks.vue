<template>
  <div>
    <b-row>
      <b-col>
        <div class="text-center" v-if="loading">
          <b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Loading"/>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!loading">
      <b-col class="app-bar-padding">
        <b-tabs pills card>
          <b-tab title="Tasks" active no-body active>
            <b-row>
              <b-col>
                <info-card class="grey-all" :class="{'op-07': task.done}" v-bind:key="task.taskId" v-for="(task, index) in openTasks" :obj="task" v-on:destroy="destroy(task)">
                  <template v-slot:header>
                    #{{index+1}} {{task.subject}}
                  </template>
                  <template v-slot:content>
                    {{task.activity.name}}
                  </template>
                  <template v-slot:footer>
                    {{task.at}} / {{task.duration}}min
                    <b-button class="float-right shadow-sm" size="sm" :variant="task.done?'success':'secondary'" @click="done(task)">
                  <span v-if="task.done">
                    Completed
                    <font-awesome-icon icon="check"/>
                  </span>
                      <span v-else>Done</span>
                    </b-button>
                  </template>
                </info-card>
                <b-alert :show="tasks.length===0" variant="primary">
                  <b-row>
                    <b-col>No tasks yet!</b-col>
                    <b-col cols="4" class="text-right">
                      <font-awesome-icon icon="tasks" size="3x" class="text-dark"/>
                    </b-col>
                  </b-row>
                </b-alert>
              </b-col>
            </b-row>
          </b-tab>
          <b-tab title="Completed" no-body>
            <info-card class="grey-all" :class="{'op-07': task.done}" v-bind:key="task.taskId" v-for="(task, index) in completedTasks" :obj="task" v-on:destroy="destroy(task)">
              <template v-slot:header>
                #{{index+1}} {{task.subject}}
              </template>
              <template v-slot:content>
                {{task.activity.name}}
              </template>
              <template v-slot:footer>
                {{task.at}} / {{task.duration}}min
                <b-button class="float-right shadow-sm" size="sm" :variant="task.done?'success':'secondary'" @click="done(task)">
                  <span v-if="task.done">
                    Completed
                    <font-awesome-icon icon="check"/>
                  </span>
                  <span v-else>Done</span>
                </b-button>
              </template>
            </info-card>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>

    <b-modal id="addTask" title="Add Entry" ok-only ok-variant="light" ok-title="Cancel" header-class="bg-primary" class="border-dark shadow-sm">
      <b-card-text>
        <b-form @submit="submit" @reset="reset">
          <b-form-group label="Learning Activity (required)">
            <b-form-select
                type="text"
                v-model="form.activityId"
                :options="activityOptions"
                required/>
          </b-form-group>

          <b-form-group label="Title of this task (required)">
            <b-form-input
                type="text"
                v-model="form.subject"
                required/>
          </b-form-group>

          <b-form-group label="When? (required)">
            <datetime type="datetime" v-model="form.at" class="form-inline form-control"></datetime>
          </b-form-group>

          <b-form-group label="Duration (minutes) (required)">
            <b-form-input
                required
                type="range"
                value="0"
                min="0"
                step="15"
                max="600"
                v-model="form.duration"/>
            <b-form-input
                required
                type="text"
                value="0"
                v-model="form.duration"
                disabled
                readonly/>
          </b-form-group>
          <hr/>
          <b-btn-group align="right">
            <b-button type="submit" variant="primary">Save</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-btn-group>
        </b-form>
      </b-card-text>
    </b-modal>

    <app-nav :items="[{name: 'add_task', label: 'Add Task'}]" v-on:select="addTask"/>
  </div>
</template>

<script>
import InfoCard from "../components/InfoCard";
import AppNav from "../components/AppNav";
import {Datetime} from "vue-datetime";

export default {
  name: "Tasks",
  components: {AppNav, InfoCard, Datetime},
  data() {
    return {
      form: {
        activityId: "",
        subject: "",
        at: "",
        duration: 0,
      },
      activities: [],
      tasks: [],
      loading: true,
    };
  },
  computed: {
    activityOptions() {
      return [{value: "", text: "[none]"}].concat(this.activities.map(activity => ({value: activity.activityId, text: activity.name})));
    },
    completedTasks() {
      return this.tasks.filter(task => task.done);
    },
    openTasks() {
      return this.tasks.filter(task => !task.done);
    },
  },
  methods: {
    done(task) {
      this.$api.doneTask({taskId: task.taskId, done: !task.done})
        .then(() => task.done = !task.done)
        .catch(() => alert("Error!"));
    },
    addTask() {
      this.reset();
      this.$bvModal.show("addTask");
    },
    submit(event) {
      event.preventDefault();
      this.$api.addTask(this.form)
        .then(task => {
          this.$bvModal.hide("addTask");
          // this.tasks.unshift(task);
          this.$api.getTasks()
            .then(res => {
              this.tasks = [];
              res.forEach(task => this.tasks.push(task));
            });
        })
        .catch(error => {
          alert(JSON.stringify(error.errors, null, 2));
        });
      return false;
    },
    destroy(task) {
      if (window.confirm("Delete?")) {
        this.$api.deleteTask({taskId: task.taskId})
          .then(() => {
            this.tasks.splice(this.tasks.indexOf(task), 1);
          })
          .catch(error => {
            alert(error.message);
          });
      }
    },
    reset() {
      Object.keys(this.form).forEach(key => this.form[key] = "");
      this.form.duration = 0;
    },
  },
  mounted() {
    Promise.all([this.$api.getTasks(), this.$api.getActivities()])
      .then(res => {
        res[0].forEach(task => this.tasks.push(task));
        res[1].forEach(activity => this.activities.push(activity));
        this.loading = false;

        setTimeout(() => {
          const activityId = this.$route.params.activityId;
          if (activityId) {
            this.addTask();
            this.form.activityId = activityId;
          }
        }, 100);
      });
  },
};
</script>

<style scoped>
</style>