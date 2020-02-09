import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000";
const JWTName = "token";

const store = window.localStorage;

class Api {
  /**
   * @returns {Promise<{token: String, user: String}>}
   */
  authenticate() {
    return new Promise(((resolve, reject) => {
      const token = this.getToken();
      const username = this.getUser();
      const axiosOptions = {
        baseURL: API_URL,
        timeout: 10000
      };

      if (!token) {
        this.createUser()
          .then(response => {
            store.setItem(JWTName, response.data.token);
            store.setItem("username", response.data.name);
            axiosOptions.headers.authorization = `Bearer ${this.getToken()}`;
            this.axios = axios.create(axiosOptions);
            resolve({token: this.getToken(), user: this.getUser()});
          })
          .catch(reject);
      } else {
        axiosOptions.headers.authorization = `Bearer ${this.getToken()}`;
        this.axios = axios.create(axiosOptions);
        resolve({token, username});
      }
    }));
  }

  /**
   * @returns {Promise<AxiosResponse<{username: String, token: String}>>}
   * @static
   */
  createUser() {
    return axios.post(`${API_URL}/auth`);
  }

  /**
   * @returns {Promise<AxiosResponse<T>>}
   */
  getTasks() {
    return this.axios.post(`${API_URL}/graphql`, {
      query: `{ tasks() {} }`
    });
  }

  /**
   * @returns {string}
   */
  getUser() {
    return store.getItem("username");
  }

  /**
   * @returns {string}
   */
  getToken() {
    return store.getItem(JWTName);
  }
}

export {Api};