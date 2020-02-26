<template>
  <div>
    <b-row>
      <b-col>
        <loader :loading="loading"/>
      </b-col>
    </b-row>
    <b-row v-if="!loading">
      <b-col class="app-bar-padding">
        <b-tabs pills card active-nav-item-class="text-dark">
          <b-tab title="Tasks" no-body active>
            <b-row>
              <b-col>

                <b-row>
                  <b-col>
                    <info-card v-bind:key="task.taskId" v-for="(task, index) in openTasks" class="grey-all" footer-class="justify-content-end" :obj="task" v-on:destroy="destroy(task)">
                      <template v-slot:header>
                        #{{index+1}} {{task.subject}}
                      </template>
                      <template v-slot:content>
                        <span class="text-primary">{{task.activity.name}}</span>,
                        <span>{{task.at}}</span>,
                        <span class="text-warning">{{task.duration}}min</span>
                      </template>
                      <template v-slot:footer>
                        <div class="float-right">
                          <b-button class="shadow-sm mr-1" size="sm" variant="info" @click="factors(task)">Factors</b-button>
                          <b-button class="shadow-sm" size="sm" variant="success" @click="done(task)">
                            <font-awesome-icon icon="check"/>
                          </b-button>
                        </div>
                      </template>
                    </info-card>

                  </b-col>
                </b-row>

                <div class="border-primary border text-primary p-3 bg-dark" v-if="openTasks.length===0">
                  <b-row>
                    <b-col>No tasks</b-col>
                    <b-col cols="4" class="text-right">
                      <font-awesome-icon icon="tasks" size="3x" class="text-primary"/>
                    </b-col>
                  </b-row>
                </div>

              </b-col>
            </b-row>
          </b-tab>
          <b-tab title="Completed" no-body @click="queryDone">
            <div class="border-primary border bg-dark text-primary p-3" v-if="completedTasks.length===0">
              <b-row>
                <b-col>No completed tasks yet!</b-col>
                <b-col cols="4" class="text-right">
                  <font-awesome-icon icon="tasks" size="3x" class="text-primary"/>
                </b-col>
              </b-row>
            </div>
            <info-card class="grey-all" footer-class="justify-content-end" v-bind:key="task.taskId" v-for="(task, index) in completedTasks" :obj="task" v-on:destroy="destroy(task)">
              <template v-slot:header>
                <span style="text-decoration: line-through">#{{index+1}} {{task.subject}}</span>
              </template>
              <template v-slot:content>
                <span class="text-primary">{{task.activity.name}}</span>,
                <span>{{task.at}}</span>,
                <span class="text-warning">{{task.duration}}min</span>
              </template>
              <template v-slot:footer>
                <b-button class="shadow-sm float-right" size="sm" variant="warning" @click="done(task)">
                  Reopen Task
                </b-button>
              </template>
            </info-card>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>

    <b-modal id="addTask" title="Add Learning Task" hide-footer header-class="bg-primary text-dark" header-border-variant="primary" footer-border-variant="primary" class="border-primary border" body-bg-variant="dark">
      <b-card-text>
        <b-form ref="form" @submit="submit" @reset="reset">
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
            <datetime type="datetime" v-model="form.at" class="form-inline bg-dark form-control"></datetime>
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
          <div>
            <hr/>
            <b-button type="submit" class="float-right" variant="primary">Save</b-button>
            <b-button class="float-left" variant="danger" @click="$bvModal.hide('addTask')">Cancel</b-button>
          </div>
        </b-form>
      </b-card-text>
    </b-modal>

    <b-modal id="factorInfo" :title="'Factors for: ' + selectedActivity.name" footer-border-variant="dark" body-text-variant="light" body-bg-variant="dark" header-border-variant="primary" header-class="text-dark" footer-bg-variant="dark" ok-only
             header-bg-variant="primary">
      <div>
        <table class="w-100 table table-sm m-0 table-borderless">
          <tbody>
          <tr v-for="affect in affects" :key="affect.affectId">
            <td class="border-primary p-0">
              <h6 class="text-primary">{{affect.factor.name}}</h6>
              <h6 class="text-light">{{affect.factor.description}}</h6>
              <div class="text-primary">Influence: <span class="text-warning">{{affect.influence.influenceDisplay}}</span></div>
              <hr/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <app-nav :items="[{name: 'add_task', label: 'Add Task'}]" v-on:select="addTask"/>
  </div>
</template>

<script>
import InfoCard from "../components/InfoCard";
import AppNav from "../components/AppNav";
import {Datetime} from "vue-datetime";
import Loader from "../components/Loader";
import {formatDateTime} from "../lib/time";

export default {
  name: "Tasks",
  components: {Loader, AppNav, InfoCard, Datetime},
  data() {
    return {
      form: {
        activityId: "",
        subject: "",
        at: "",
        duration: 0,
      },
      // In accordance to the activity a the selected task
      affects: [],
      selectedActivity: {name: ""},
      activities: [],
      tasks: [],
      loading: true,
      loadedDone: false,
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
    factors(task) {
      this.selectedActivity = task.activity;
      this.$api.getActivityAffectedBy({activityId: task.activityId})
        .then(affects => {
          while (this.affects.length > 0) {
            this.affects.pop();
          }
          affects.forEach(affect => this.affects.push(affect));
          this.$bvModal.show("factorInfo");
        });
    },
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
          this.tasks.unshift(task);
        })
        .catch(error => alert(JSON.stringify(error.errors, null, 2)));
      return false;
    },
    destroy(task) {
      if (window.confirm("Delete?")) {
        this.$api.deleteTask({taskId: task.taskId})
          .then(() => this.tasks.splice(this.tasks.indexOf(task), 1))
          .catch(error => alert(error.message));
      }
    },
    reset() {
      Object.keys(this.form).forEach(key => this.form[key] = "");
      this.form.duration = 0;
    },
    queryDone() {
      if (!this.loadedDone) {
        this.loadedDone = true;
        this.$api.getTasks({done: true})
          .then(tasks => tasks.forEach(task => {
            task.at = formatDateTime(task.at);
            this.tasks.push(task);
          }));
      }
    },
  },
  mounted() {
    Promise.all([this.$api.getTasks({done: false}), this.$api.getActivities()])
      .then(res => {
        res[0].forEach(task => this.tasks.push(task));
        res[1].forEach(activity => this.activities.push(activity));
        this.loading = false;

        setTimeout(() => {
          const activityId = this.$route.params.activityId;
          if (activityId) {
            this.addTask();
            this.form.activityId = activityId;
            this.$router.replace("/tasks");
          }
        }, 100);
      });
  },
};
</script>

<style scoped>
</style>