import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
const TOKEN_KEY = "api-token";

const store = window.localStorage;

/**
 * @typedef AxiosResponse
 * @type {Object}
 * @property {*} data
 * @property {Number} status
 * @property {String} statusText
 * @property {*} headers
 * @property {Object} config
 * @property {*} [request]
 */

/**
 * @typedef Affect
 * @type {Object}
 * @property {Number} [affectId]
 * @property {Number} aspectId
 * @property {Number} factorId
 * @property {String} influenceName
 * @property {String} source
 * @property {String} [description]
 * @property {Factor} [factor]
 * @property {Aspect} [aspect]
 * @property {Influence} [influence]
 */

/**
 * @typedef Factor
 * @type {Object}
 * @property {Number} [factorId]
 * @property {String} name
 * @property {String} description
 */

/**
 * @typedef AspectType
 * @type {Object}
 * @property {String} typeName
 * @property {String} typeDisplay
 */

/**
 * @typedef aspectId
 * @type {Object}
 * @property {Number} [aspectId]
 * @property {String} name
 * @property {String} description
 * @property {AspectType} aspectType
 */

/**
 * @typedef Client
 * @type {Object}
 * @property {Number} [clientId]
 * @property {String} name
 * @property {String} password
 * @property {String} token
 */

/**
 * @typedef Influence
 * @type {Object}
 * @property {String} influenceName
 * @property {String} influenceDisplay
 */

/**
 * @typedef Task
 * @type {Object}
 * @property {Number} [taskId]
 * @property {Number} aspectId
 * @property {String} subject
 * @property {String} at
 * @property {String} atFormatted
 * @property {Number} duration
 * @property {Aspect} [aspect]
 * @property {boolean} done
 */

/**
 * Does error management.
 * @param {Promise} promise
 * @returns {Promise<void|Client|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
 */
function handleRequest(promise) {
  return new Promise((resolve, reject) => {
    promise
      .then(res => resolve(res.data))
      .catch(error => {
        reject(error.response.data);
      });
  });
}

class AuthClient {
  /**
   * @returns {Promise<{token: String, password: String}>}
   */
  authenticate() {
    return new Promise((resolve, reject) => {
      const token = this.getToken();
      const axiosOptions = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        baseURL: API_URL,
        timeout: 10000,
      };

      if (!token) {
        this.createClient()
          .then(response => {
            store.setItem(TOKEN_KEY, response.data.token);
            store.setItem("password", response.data.password);
            axiosOptions.headers.authorization = `Bearer ${this.getToken()}`;
            this.axios = axios.create(axiosOptions);
            resolve({token: this.getToken(), password: this.getPassword()});
          })
          .catch(reject);
      } else {
        axiosOptions.headers.authorization = `Bearer ${this.getToken()}`;
        this.axios = axios.create(axiosOptions);
        this.getClient()
          .then(({password, token}) => resolve({token, password: password}))
          .catch(res => {
            if (res.statusCode === 404) {
              store.removeItem(TOKEN_KEY);
              store.removeItem("password");
              this.authenticate()
                .then(({password, token}) => resolve({token, password: password}));
            }
          });
      }
    });
  }

  /**
   * @returns {Promise<AxiosResponse<{password: String, token: String}>>}
   * @static
   */
  createClient() {
    return axios.post(`${API_URL}/clients/authenticate`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({password: null}),
    });
  }

  /**
   * @returns {Promise<Client>}
   */
  getClient() {
    return handleRequest(this.axios.get(`${API_URL}/clients`));
  }

  /**
   * @returns {string}
   * @private
   */
  getPassword() {
    return store.getItem("password");
  }

  /**
   * @returns {string}
   * @private
   */
  getToken() {
    return store.getItem(TOKEN_KEY);
  }
}

class ApiInstance {
  constructor(axios, controller) {
    this.axios = axios;
    this.controller = controller;
  }

  /**
   * @param {number} [page]
   * @param {number} [size]
   * @returns {Promise<void|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
   */
  toList({page = 0, size = 0} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/${this.controller}/${page}/${size}`));
  }

  /**
   * @param {Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]} data
   * @returns {Promise<void|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
   */
  save(data) {
    return handleRequest(this.axios.post(`${API_URL}/${this.controller}`, data));
  }

  /**
   * @param {Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]} data
   * @returns {Promise<void|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
   */
  update(data) {
    return handleRequest(this.axios.put(`${API_URL}/${this.controller}`, data));
  }

  /**
   * @param {string} id
   * @returns {Promise<void|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
   */
  destroy(id) {
    return handleRequest(this.axios.delete(`${API_URL}/${this.controller}/${id}`));
  }
}

class Aspect extends ApiInstance {
  constructor(axios) {super(axios, "aspects");}

  /**
   * @param {Number} aspectId
   * @returns {Promise<Aspect[]>}
   */
  getAspectAffectedBy({aspectId: aspectId} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/aspects/affect/${aspectId}`));
  }
}

class ClientTasks extends ApiInstance {
  constructor(axios) {super(axios, "clienttasks");}

  /**
   * @returns {Promise<Task[]>>}
   */
  toListCompleted() {
    return handleRequest(this.axios.get(`${API_URL}/clienttasks/done`, {params: {done: true}}));
  }

  /**
   * @returns {Promise<Task[]>>}
   */
  toListOpen() {
    return handleRequest(this.axios.get(`${API_URL}/clienttasks/done`, {params: {done: false}}));
  }

  /**
   * @param {string} taskId
   * @param {boolean} done
   */
  done({taskId, done} = {}) {
    return handleRequest(this.axios.put(`${API_URL}/clienttasks/done`, {taskId, done}));
  }
}

class Client extends ApiInstance {
  constructor(axios) {
    super(axios, "clients");
    this.tasks = new ClientTasks(axios);
  }
}

class Factor extends ApiInstance {
  constructor(axios) {
    super(axios, "factors");
  }
}

class FactorType extends ApiInstance {
  constructor(axios) {super(axios, "factors/types");}
}

class Influence extends ApiInstance {
  constructor(axios) {super(axios, "influences");}
}

class AspectType extends ApiInstance {
  constructor(axios) {super(axios, "aspecttypes");}
}

class Affect extends ApiInstance {
  constructor(axios) {super(axios, "affects");}
}

let authInstance = null;
const apiInstances = {
  clients: undefined,
  influences: undefined,
  affects: undefined,
  aspects: undefined,
  aspectTypes: undefined,
  factors: undefined,
  factorTypes: undefined,
};

/**
 * @returns {Promise<{}>}
 */
function createInstance() {
  return new Promise((resolve, reject) => {
    if (authInstance === null) {
      authInstance = new AuthClient();
      authInstance.authenticate()
        .then(() => {
          apiInstances.influences = new Influence(authInstance.axios);
          apiInstances.affects = new Affect(authInstance.axios);
          apiInstances.aspects = new Aspect(authInstance.axios);
          apiInstances.aspectTypes = new AspectType(authInstance.axios);
          apiInstances.clients = new Client(authInstance.axios);
          apiInstances.factors = new Factor(authInstance.axios);
          apiInstances.factorTypes = new FactorType(authInstance.axios);
          resolve(apiInstances);
        })
        .catch(reject);
    } else {
      resolve(apiInstances);
    }
  });
}

export {createInstance};