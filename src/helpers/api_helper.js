import axios from "axios";
import { api } from "./config";
import { message } from "antd";

// default
// axios.defaults.baseURL = api.API_URL;
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

const token = sessionStorage.getItem("authUser")
  ? sessionStorage.getItem("authUser")
  : null;

if (token)
  axios.defaults.headers.common["Authorization"] = token.replace(/"/g, "");

// intercepting to capture errors
axios.interceptors.response.use(
  function (config) {
    const token = sessionStorage.getItem("authUser")
      ? sessionStorage.getItem("authUser")
      : null;

    if (token)
      axios.defaults.headers.common["Authorization"] = token.replace(/"/g, "");
    return config;
  },
  function (response) {
    return response;
  },
  function (error) {
    console.error(error);
    if (error.response.data.message === "jwt expired") {
      message.error(`Vui lòng đăng nhập để tiếp tục!`);
      setTimeout(() => {
        sessionStorage.removeItem("authUser");
        window.location.replace("/logout");
      }, 3000);
    }

    return Promise.reject();
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
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return user;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
