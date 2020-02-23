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
 * @property {Number} activityId
 * @property {Number} factorId
 * @property {String} influenceName
 * @property {String} source
 * @property {String} [description]
 * @property {Factor} [factor]
 * @property {Activity} [activity]
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
 * @typedef Activity
 * @type {Object}
 * @property {Number} [activityId]
 * @property {String} name
 * @property {String} description
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
 * @property {Number} activityId
 * @property {String} subject
 * @property {String} [at]
 * @property {Number} [duration]
 * @property {Activity} [activity]
 */

/**
 * Does error management.
 * @param {Promise} promise
 * @returns {Promise<void|AxiosResponse<Activity|Task|Influence|Factor|Affect|*[]>>}
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
   * @returns {Promise<Activity[]>}
   */
  getActivities() {
    return handleRequest(this.axios.get(`${API_URL}/activities`));
  }

  /**
   * @param {Number} activityId
   * @returns {Promise<Activity[]>}
   */
  getActivityAffectedBy({activityId} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/activities/affect/${activityId}`));
  }

  /**
   * @returns {Promise<Task[]>}
   */
  getTasks() {
    return handleRequest(this.axios.get(`${API_URL}/clients/tasks`));
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
   * @returns {Promise<Affect[]>}
   */
  getAffects({page = 0, size = 100} = {}) {
    return handleRequest(this.axios.get(`${API_URL}/affects/${page}/${size}`));
  }

  /**
   * @param {Number} id
   * @returns {Promise<void>}
   */
  deleteActivity(id) {
    return handleRequest(this.axios.delete(`${API_URL}/activities/${id}`));
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
   * @param {Activity} task
   * @returns {Promise<AxiosResponse<Activity>>}
   */
  addActivity(activity) {
    return handleRequest(this.axios.post(`${API_URL}/activities`, activity));
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