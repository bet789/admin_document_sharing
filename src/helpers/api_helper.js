import axios from "axios";
import { api } from "./config";
import { notification } from "antd";

// default
// axios.defaults.baseURL = api.API_URL;
axios.defaults.baseURL = api.API_URL_DEV;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

const token = sessionStorage.getItem("token")
  ? sessionStorage.getItem("token")
  : null;

if (token)
  axios.defaults.headers.common["Authorization"] = token.replace(/"/g, "");

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : null;

    if (token)
      axios.defaults.headers.common["Authorization"] = token.replace(/"/g, "");
    return config;
  },
  function (error) {
    console.log("Request error: " + error);
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    console.log("Response error: " + error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error === "Request failed with status code 403")
      // `Request failed with status code 403 - Bạn không có quyền sử dụng chức năng này!`
      // setTimeout(() => {
      //   sessionStorage.removeItem("token");
      //   sessionStorage.removeItem("infoUsers");
      //   // window.location.replace("/logout");
      // }, 3000);
      return Promise.reject(error);
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = token.replace(/"/g, "");
};

class APIClient {
  get = async (url, params) => {
    let response;
    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });
      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      await axios
        .get(`${url}?${queryString}`, params)
        .then(function (res) {
          response = res.data ? res.data : res;
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      await axios
        .get(`${url}`, params)
        .then(function (res) {
          response = res.data ? res.data : res;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    return response;
  };

  post = (url, data) => {
    return axios.post(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };

  createWithFormData = (url, data) => {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return axios.post(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };

  updateWithFormData = (url, data) => {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return axios.put(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("token");
  if (!user) {
    return null;
  } else {
    return user;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
