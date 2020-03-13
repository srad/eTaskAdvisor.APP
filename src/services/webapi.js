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
 * @returns {Promise<void|Aspect|AspectType|Task|Influence|Factor|Affect|Aspect[]|AspectType[]|Task[]|Influence[]|Factor[]|Affect[]>}
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

class Api {
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
   * @returns {Promise<Aspect[]>}
   */
  getAspects() {
    return handleRequest(this.axios.get(`${API_URL}/aspects`));
  }

  /**
   * @param {Number} aspectId
   * @returns {Promise<Aspect[]>}
   */
  getAspectAffectedBy({aspectId: aspectId} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/aspects/affect/${aspectId}`));
  }

  /**
   * @param {boolean} done
   * @returns {Promise<Task[]>}
   */
  getTasks({done}) {
    return handleRequest(this.axios.get(`${API_URL}/clients/tasks`, {params: {done}}));
  }

  /**
   * @returns {Promise<Factor[]>}
   */
  getFactors() {
    return handleRequest(this.axios.get(`${API_URL}/factors`));
  }

  /**
   * @param page
   * @param size
   * @returns {Promise<Influence[]>}
   */
  getInfluences() {
    return handleRequest(this.axios.get(`${API_URL}/influences`));
  }

  /**
   * @param page
   * @param size
   * @returns {Promise<AspectType[]>}
   */
  getAspectTypes() {
    return handleRequest(this.axios.get(`${API_URL}/aspects/types`));
  }

  /**
   * @param page
   * @param size
   * @returns {Promise<Affect[]>}
   */
  getAffects({page = 0, size = 100} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/affects/${page}/${size}`));
  }

  /**
   * @param {Number} id
   * @returns {Promise<void>}
   */
  deleteAspect(id) {
    return handleRequest(this.axios.delete(`${API_URL}/aspects/${id}`));
  }

  /**
   * @param {Number} taskId
   * @returns {Promise<void>}
   */
  deleteTask({taskId} = {}) {
    return handleRequest(this.axios.delete(`${API_URL}/clients/tasks/${taskId}`));
  }

  /**
   * @param {Number} id
   * @returns {Promise<void>}
   */
  deleteFactor(id) {
    return handleRequest(this.axios.delete(`${API_URL}/factors/${id}`));
  }

  /**
   * @param {Number} id
   * @returns {Promise<void>}
   */
  deleteInfluence(id) {
    return handleRequest(this.axios.delete(`${API_URL}/influences/${id}`));
  }

  /**
   * @param {Number} id
   * @returns {Promise<void>}
   */
  deleteAffect(id) {
    return handleRequest(this.axios.delete(`${API_URL}/affects/${id}`));
  }

  /**
   * @param {Aspect} aspect
   * @returns {Promise<AxiosResponse<Aspect>>}
   */
  addAspect(aspect) {
    return handleRequest(this.axios.post(`${API_URL}/aspects`, aspect));
  }

  /**
   * @param {Task} task
   * @returns {Promise<AxiosResponse<Task>>}
   */
  addTask(task) {
    if (task.at === "") {
      task.at = null;
    }
    const p = parseInt(String(task.duration));
    task.duration = isNaN(p) ? null : p;
    return handleRequest(this.axios.post(`${API_URL}/clients/tasks`, task));
  }

  /**
   * @param {number} taskId
   * @param {boolean} done
   * @returns {Promise<void|AxiosResponse<Aspect|Task|Influence|Factor|Affect|*[]>>}
   */
  doneTask(task) {
    return handleRequest(this.axios.post(`${API_URL}/clients/done`, task));
  }

  /**
   * @param {Influence} influence
   * @returns {Promise<AxiosResponse<Influence>>}
   */
  addInfluence(influence) {
    return handleRequest(this.axios.post(`${API_URL}/influences`, influence));
  }

  /**
   * @param {Affect} affect
   * @returns {Promise<AxiosResponse<Affect>>}
   */
  addAffect(affect) {
    return handleRequest(this.axios.post(`${API_URL}/affects`, affect));
  }

  /**
   * @param {{Factor} task
   * @returns {Promise<AxiosResponse<Factor>>}
   */
  addFactor(factor) {
    return handleRequest(this.axios.post(`${API_URL}/factors`, factor));
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

export {Api};