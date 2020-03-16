<template>
  <b-row>
    <b-col class="app-bar-padding">
      <b-tabs pills card active-nav-item-class="text-dark" nav-wrapper-class="p-2 m-0">
        <b-tab title="Aspect" active no-body @click="view('aspect')" title-link-class="p-2">
          <table class="d-none d-md-table table table-dark shadow-sm table-hover table-bordered">
            <thead class="thead-primary">
            <th width="25%">Name</th>
            <th width="10%">Type</th>
            <th>Description</th>
            <th width="10%">Delete</th>
            </thead>
            <tbody>
            <tr :key="aspect.aspectId" v-for="aspect in aspects">
              <td>{{aspect.name}}</td>
              <td>{{aspect.aspectType.name}}
              <td>{{aspect.description}}</td>
              <td>
                <b-button variant="danger" class="p-0" size="sm" block @click="destroy(aspect)">Delete</b-button>
              </td>
            </tr>
            </tbody>
          </table>

          <info-card class="d-md-none mt-2" v-bind:key="aspect.aspectId" v-for="aspect in aspects" :obj="aspect" v-on:destroy="destroy(aspect)">
            <template v-slot:header>
              {{aspect.name}} <span class="ml-2 badge badge-warning border-dark border shadow-sm">{{aspect.aspectType.name}}</span>
            </template>
            <template v-slot:content>
              {{aspect.description}}
            </template>
          </info-card>
        </b-tab>

        <b-tab title="Factor" no-body class=" border-0" @click="view('factor')" title-link-class="p-2">
          <table class="d-none d-md-table table table-dark shadow-sm table-hover table-bordered">
            <thead class="thead-dark">
            <th width="25%">Name</th>
            <th width="15%">Type</th>
            <th>Description</th>
            <th width="10%">Delete</th>
            </thead>
            <tbody>
            <tr :key="factor.factorId" v-for="factor in factors">
              <td>{{factor.name}}</td>
              <td>{{factor.factorType.name}}</td>
              <td>{{factor.description}}</td>
              <td>
                <b-button variant="danger" size="sm" block @click="destroy(factor)">Delete</b-button>
              </td>
            </tr>
            </tbody>
          </table>
          <info-card class="d-md-none mt-2" v-bind:key="factor._id" v-for="factor in factors" :obj="factor" v-on:destroy="destroy(factor)">
            <template v-slot:header>
              {{factor.name}} <span class="ml-2 shadow-sm border-dark border p-1 badge-warning badge">{{factor.factorType.name}}</span>
            </template>
            <template v-slot:content>
              {{factor.description}}
            </template>
          </info-card>
        </b-tab>

        <b-tab title="Affect" no-body @click="view('affect')" title-link-class="p-2">
          <b-form class="w-100 p-2 mb-2 d-none d-md-table">
            <label class="mr-sm-2 text-bold text-primary">Filter</label>
            <b-form-select style="width: 150px" class="mr-2" size="sm" v-model="filterAspect" :options="aspectOptions"/>
            <b-form-select style="width: 150px" class="mr-2" v-model="filterFactor" size="sm" :options="factorOptions"/>
            <b-form-select style="width: 150px" v-model="filterInfluence" size="sm" :options="influenceOptions"/>
            <b-button class="ml-2" variant="warning" size="sm" @click="resetFilters">Reset</b-button>
            <b-button class="ml-2" variant="outline-dark" size="sm" disabled>Count: {{filteredAffects.length}}</b-button>
          </b-form>

          <table class="d-none d-md-table text-sm table-hover table-dark table table-bordered">
            <thead class="thead-dark">
            <th width="40%">Aspect</th>
            <th width="30%">Is Affected By</th>
            <th width="20%">Influence</th>
            <th width="10%">Delete</th>
            </thead>
            <tbody v-if="filteredAffects.length === 0">
            <tr>
              <td colspan="4">Nothing found</td>
            </tr>
            </tbody>
            <tbody v-else v-for="affect in filteredAffects" :key="affect.affectId" style="border-top: 2px double #9bc53d;">
            <tr>
              <td>
                <span>
                  {{affect.aspect.name}}
                </span>
              </td>
              <td>
                <span>
                {{affect.factor.name}}
                </span>
              </td>
              <td>
                <span class="p-1"
                      v-bind:class="{'badge-success': affect.influence.name==='Positive', 'badge-secondary': affect.influence.name==='Unclear', 'badge-danger': affect.influence.name==='Negative', 'badge-warning': affect.influence.name==='Indifferent'}">
                {{affect.influence.name}}
                </span>
              </td>
              <td>
                <b-button variant="danger" class="p-0" size="sm" block @click="destroy(affect)">Delete</b-button>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                {{affect.description}}
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <a href="affect.source" target="_blank">{{affect.source}}</a>
              </td>
            </tr>
            </tbody>
          </table>

          <info-card class="d-md-none mt-2" v-bind:key="affect.affectId" deck v-for="affect in filteredAffects" :obj="affect" v-on:destroy="destroy(affect)">
            <template v-slot:header>
              {{affect.aspect.name}}
            </template>
            <template v-slot:content>
              <span class="text-warning m-1">{{affect.aspect.name}}</span>
              <span class="m-1">is affected by</span>
              <span class="text-warning m-1">{{affect.factor.name}}</span>:
              <span class="badge m-1"
                    v-bind:class="{'badge-success': affect.influence.name==='Positive', 'badge-danger': affect.influence.name==='Negative', 'badge-warning': affect.influence.name==='Indifferent'}">{{affect.influence.name}}</span>
              <hr class="m-0 mb-2 mt-2"/>
              {{affect.description}}
              <hr class="m-0 mb-2 mt-2"/>
              Source: <a class="text-info" :href="affect.source">{{affect.source}}</a>
            </template>
          </info-card>
        </b-tab>

        <b-tab title="Type" no-body @click="view('aspectType')" title-link-class="p-2">
          <table class="d-none d-md-table table table-dark shadow-sm table-hover table-bordered">
            <thead class="thead-dark">
            <th width="25%">Name</th>
            <th>Description</th>
            <th width="10%">Delete</th>
            </thead>
            <tbody>
            <tr :key="aspectType.aspectTypeId" v-for="aspectType in aspectTypes">
              <td>{{aspectType.name}}</td>
              <td>{{aspectType.description}}</td>
              <td>
                <b-button variant="danger" size="sm" block @click="destroy(factor)">Delete</b-button>
              </td>
            </tr>
            </tbody>
          </table>
          <info-card class="d-md-none mt-2" v-bind:key="aspectType.aspectTypeId" v-for="aspectType in aspectTypes" :obj="aspectType" v-on:destroy="destroy(aspectType)">
            <template v-slot:header>
              {{aspectType.name}}
            </template>
            <template v-slot:content>
              {{aspectType.description}}
            </template>
          </info-card>
        </b-tab>

        <b-tab title="Category" no-body @click="view('factorType')" title-link-class="p-2">
          <h5 class="p-2 text-primary">Factor Types</h5>
          <hr class="mt-0 mb-3"/>
          <info-card class="mt-2" v-bind:key="factorType.factorTypeId" v-for="factorType in factorTypes" :obj="factorType" v-on:destroy="destroy(factorType)">
            <template v-slot:header>{{factorType.name}}</template>
            <template v-slot:content>{{factorType.description}}</template>
          </info-card>
        </b-tab>
      </b-tabs>

      <b-modal id="addEntry" title="Add Entry" header-class="text-dark" header-border-variant="primary" header-bg-variant="primary" hide-footer body-bg-variant="dark">
        <b-card-text>
          <b-form @submit="onSubmit" @reset="onReset">
            <template v-if="type==='aspect'">
              <b-form-group label="Name:">
                <b-form-input
                    v-model="form.aspect.name"
                    type="text"
                    required/>
              </b-form-group>

              <b-form-group label="Type of effect:">
                <b-form-select v-model="form.aspect.aspectTypeId" size="sm" :options="aspectTypeOptions"></b-form-select>
              </b-form-group>

              <b-form-group label="Description:">
                <b-form-textarea
                    v-model="form.aspect.description"
                    required
                ></b-form-textarea>
              </b-form-group>
            </template>

            <template v-if="type==='aspectType'">
              <b-form-group label="Name:">
                <b-form-input
                    v-model="form.aspectType.name"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Value(internal use):">
                <b-form-input
                    v-model="form.aspectType.value"
                    type="text"
                    required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Description:">
                <b-form-textarea v-model="form.aspectType.description" required/>
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

              <b-form-group label="Type of effect:">
                <b-form-select v-model="form.factor.factorTypeId" size="sm" :options="factorTypeOptions"></b-form-select>
              </b-form-group>

              <b-form-group label="Description:">
                <b-form-textarea v-model="form.factor.description" required/>
              </b-form-group>
            </template>

            <template v-if="type==='affect'">
              <b-form-group label="Aspect">
                <b-form-select
                    v-model="form.affect.aspectId"
                    :options="aspectOptions"
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
                    v-model="form.affect.influenceId"
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
            <b-button type="submit" variant="primary" class="float-right">Save</b-button>
            <b-button variant="danger" @click="$bvModal.hide('addEntry')">Cancel</b-button>
          </b-form>
        </b-card-text>
      </b-modal>

      <app-nav :items="[{name: 'add_entry', label: 'Add Entry'}]" v-on:select="addEntry"/>
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
        aspects: [],
        affects: [],
        aspectTypes: [],
        factors: [],
        influences: [],
        factorTypes: [],
      },

      filterAspect: "",
      filterFactor: "",
      filterInfluence: "",

      saved: true,

      type: "aspect",
      display: "aspect",

      aspects: [],
      aspectTypes: [],
      affects: [],
      factors: [],
      influences: [],
      factorTypes: [],

      formValue: {},
      form: {
        factorType: {
          factorTypeId: "",
          name: "",
          description: "",
        },
        aspect: {
          aspectId: "",
          aspectTypeId: "",
          name: "",
          description: "",
        },
        factor: {
          factorId: "",
          factorTypeId: "",
          name: "",
          description: "",
        },
        aspectType: {
          aspectTypeId: "",
          name: "",
          description: "",
        },
        affect: {
          affectId: "",
          aspectId: "",
          factorId: "",
          influenceId: "",
          source: "",
          description: "",
        },
        checked: [],
      },
      show: true,
    };
  },
  computed: {
    // Provide only activities here
    aspectOptions() {
      return [{value: "", text: "[select]"}].concat(this.cache.aspects.map(aspect => ({value: aspect.aspectId, text: `${aspect.name} (${aspect.aspectType.name})`})));
    },
    factorOptions() {
      return [{value: "", text: "[select]"}].concat(this.cache.factors.map(factor => ({value: factor.factorId, text: factor.name})));
    },
    influenceOptions() {
      return [{value: "", text: "[select]"}].concat(this.cache.influences.map(influence => ({value: influence.influenceId, text: influence.name})));
    },
    aspectTypeOptions() {
      return [{value: "", text: "[select]"}].concat(this.cache.aspectTypes.map(type => ({value: type.aspectTypeId, text: type.name})));
    },
    factorTypeOptions() {
      return [{value: "", text: "[select]"}].concat(this.cache.factorTypes.map(type => ({value: type.factorTypeId, text: type.name})));
    },
    filteredAffects() {
      let result = this.cache.affects;

      if (this.filterAspect !== "") {
        result = result.filter(affect => affect.aspectId === this.filterAspect);
      }
      if (this.filterFactor !== "") {
        result = result.filter(affect => affect.factorId === this.filterFactor);
      }
      if (this.filterInfluence !== "") {
        result = result.filter(affect => affect.influenceId === this.filterInfluence);
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
      while (this.aspects.length > 0) {
        this.aspects.pop();
      }
    },
    filterFactor(val) {
      this.factors = this.query.factors.filter(f => f.factorId === val);
    },
     */
  },
  methods: {
    addEntry() {
      this.clear();
      this.$bvModal.show("addEntry");
    },
    view(tab) {
      this.display = tab;
      this.type = tab;
    },
    resetFilters() {
      this.filterInfluence = "";
      this.filterAspect = "";
      this.filterFactor = "";
    },
    destroy(option) {
      if (window.confirm("Delete?")) {
        switch(this.display) {
        case "aspect":
          this.$api.aspects.destroy(option.aspectId)
            .then(() => {
              this.aspects.splice(this.aspects.indexOf(option), 1);
            });
          break;
        case "factor":
          this.$api.factors.destroy(option.factorId)
            .then(() => {
              this.factors.splice(this.factors.indexOf(option), 1);
            });
          break;
        case "aspectType":
          this.$api.aspectTypes.destroy(option.aspectTypeId)
            .then(() => {
              this.aspectTypes.splice(this.aspectTypes.indexOf(option), 1);
            });
          break;
        case "affect":
          this.$api.affects.destroy(option.affectId)
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
      case "aspect":
        this.$api.aspects.save(data)
          .then(res => {
            this.aspects.unshift(res);
            this.cache.aspects.unshift(res);
            done();
          });
        break;
      case "aspectType":
        this.$api.aspectTypes.save(data)
          .then(res => {
            this.aspectTypes.unshift(res);
            this.cache.aspectTypes.unshift(res);
            done();
          });
        break;
      case "factor":
        this.$api.factors.save(data)
          .then(res => {
            this.factors.unshift(res);
            this.cache.factors.unshift(res);
            done();
          });
        break;
      case "affect":
        this.$api.affects.save(data)
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
    Promise.all([
      this.$api.aspects.toList(),
      this.$api.factors.toList(),
      this.$api.affects.toList(),
      this.$api.influences.toList(),
      this.$api.aspectTypes.toList(),
      this.$api.factorTypes.toList(),
    ])
      .then(res => {
        const aspects = res[0];
        const factors = res[1];
        const affects = res[2];
        const influences = res[3];
        const aspectTypes = res[4];
        const factorTypes = res[5];

        aspects.forEach(aspect => {
          this.aspects.push(aspect);
          this.cache.aspects.push(aspect);
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
        aspectTypes.forEach(type => {
          this.aspectTypes.push(type);
          this.cache.aspectTypes.push(type);
        });
        console.log(factorTypes);
        factorTypes.forEach(type => {
          this.factorTypes.push(type);
          this.cache.factorTypes.push(type);
        });
      });
  },
};
</script>

<style scoped>
</style>