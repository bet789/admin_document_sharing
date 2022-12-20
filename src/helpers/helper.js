import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

//auth
export const login = (data) => {
  return api.post(url.API_LOGIN, data);
};
