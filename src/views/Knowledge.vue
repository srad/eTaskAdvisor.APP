<template>
  <b-row>
    <b-col class="app-bar-padding">
      <b-tabs pills card active-nav-item-class="text-dark">
        <b-tab title="Aspects" active no-body @click="view('aspect')">
          <table class="d-none d-md-table table table-dark shadow-sm table-hover table-bordered">
            <thead class="thead-primary">
              <th width="25%">Name</th>
              <!--<th width="10%">Type</th>-->
              <th>Description</th>
              <th width="10%">Delete</th>
            </thead>
            <tbody>
              <tr :key="aspect.aspectId" v-for="aspect in aspects">
                <td>{{aspect.name}}</td>
                <!--<td>{{aspect.aspectType.typeDisplay}}</td>-->
                <td>{{aspect.description}}</td>
                <td>
                  <b-button variant="danger" class="p-0" size="sm" block @click="destroy(aspect)">Delete</b-button>
                </td>
              </tr>
            </tbody>
          </table>

          <info-card class="d-md-none mt-2" v-bind:key="aspect.aspectId" v-for="aspect in aspects" :obj="aspect" v-on:destroy="destroy(aspect)">
            <template v-slot:header>
              {{aspect.name}} <!--({{aspect.aspectType.typeDisplay}})-->
            </template>
            <template v-slot:content>
              {{aspect.description}}
            </template>
          </info-card>
        </b-tab>

        <b-tab title="Factors" no-body class=" border-0" @click="view('factor')">
          <table class="d-none d-md-table table table-dark shadow-sm table-hover table-bordered">
            <thead class="thead-dark">
              <th width="25%">Name</th>
              <th>Description</th>
              <th width="10%">Delete</th>
            </thead>
            <tbody>
              <tr :key="factor.factorId" v-for="factor in factors">
                <td>{{factor.name}}</td>
                <td>{{factor.description}}</td>
                <td>
                  <b-button variant="danger" size="sm" block @click="destroy(factor)">Delete</b-button>
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
          <b-form class="w-100 p-2 mb-2 d-none d-md-table">
            <label class="mr-sm-2 text-bold text-primary">Filter</label>
            <b-form-select style="width: 150px" class="mr-2" size="sm" v-model="filterAspect" :options="aspectOptions"></b-form-select>
            <b-form-select style="width: 150px" class="mr-2" v-model="filterFactor" size="sm" :options="factorOptions"></b-form-select>
            <b-form-select style="width: 150px" v-model="filterInfluence" size="sm" :options="influenceOptions"></b-form-select>
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
            <tbody v-else v-for="affect in filteredAffects" :key="affect.affectId" style="border-top: 2px double #9BC53D;">
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
                <span class="p-1" v-bind:class="{'badge-success': affect.influenceName==='positive', 'badge-danger': affect.influenceName==='negative', 'badge-warning': affect.influenceName==='indifferent'}">
                {{affect.influence.influenceDisplay}}
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
              <span class="badge m-1" v-bind:class="{'badge-success': affect.influenceName==='positive', 'badge-danger': affect.influenceName==='negative', 'badge-warning': affect.influenceName==='indifferent'}">{{affect.influence.influenceDisplay}}</span>
              <hr class="m-0 mb-2 mt-2"/>
              {{affect.description}}
              <hr class="m-0 mb-2 mt-2"/>
              Source: <a class="text-info" :href="affect.source">{{affect.source}}</a>
            </template>
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
                <b-form-select v-model="form.aspect.typeName" size="sm" :options="aspectTypeOptions"></b-form-select>
              </b-form-group>

              <b-form-group label="Description:">
                <b-form-textarea
                    v-model="form.aspect.description"
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
      },

      filterAspect: "",
      filterFactor: "",
      filterInfluence: "",

      saved: true,

      type: "aspect",
      display: "aspect",

      types: [{value: "aspect", text: "Aspect"}, {value: "factor", text: "Factor"}, {value: "affect", text: "Affects"}],

      aspects: [],
      aspectTypes: [],
      affects: [],
      factors: [],
      influences: [],

      formValue: {},
      form: {
        aspect: {
          aspectId: "",
          typeName: "",
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
          aspectId: "",
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
    // Provide only activities here
    aspectOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.aspects.filter(a => a.typeName === "activity").map(aspect => ({value: aspect.aspectId, text: aspect.name})));
    },
    factorOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.factors.map(factor => ({value: factor.factorId, text: factor.name})));
    },
    influenceOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.influences.map(influence => ({value: influence.influenceName, text: influence.influenceDisplay})));
    },
    aspectTypeOptions() {
      return [{value: "", text: "[none]"}].concat(this.cache.aspectTypes.map(influence => ({value: influence.typeName, text: influence.typeDisplay})));
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
        switch (this.display) {
        case "aspect":
          this.$api.deleteAspect(option.aspectId)
            .then(() => {
              this.aspects.splice(this.aspects.indexOf(option), 1);
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

      switch (this.type) {
      case "aspect":
        data.aspectId = 0;
        this.$api.addAspect(data)
          .then(res => {
            this.aspects.unshift(res);
            this.cache.aspects.unshift(res);
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
    Promise.all([
      this.$api.getAspects(),
      this.$api.getFactors(),
      this.$api.getAffects(),
      this.$api.getInfluences(),
      this.$api.getAspectTypes(),
    ])
      .then(res => {
        const aspects = res[0];
        const factors = res[1];
        const affects = res[2];
        const influences = res[3];
        const aspectTypes = res[4];

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
      });
  },
};
</script>

<style scoped>
</style>