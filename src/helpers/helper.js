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

export const GAuth = (data) => {
  return api.post(url.API_GAUTH_AUTHENTICATE, data);
};

//Media server
export const getAllFileByCollectionID = (data) => {
  return api.get(`${url.API_MEDIA_GET_ALL_FILE_BY_COLLECTIONID}`);
};

//management account
export const getAllRoles = (data) => {
  return api.get(url.API_ROLE_GET_ALL, data);
};

export const inserRole = (data) => {
  return api.post(url.API_ROLE_INSERT, data);
};

export const updateRole = (data) => {
  return api.put(url.API_ROLE_UPDATE, data);
};

export const deleteRole = (data) => {
  return api.delete(`${url.API_ROLE_DELETE}?id=${data}`);
};

export const getByRoleId = (data) => {
  return api.get(`${url.API_ACTION_GET_BY_ROLE_ID}?roleId=${data}`);
};

export const getAllActions = () => {
  return api.get(`${url.API_ACTION_GET_ALL}`);
};

export const insertManyRoleAction = (data) => {
  return api.post(`${url.API_ROLE_ACTION_INSERT_MANY}`, data);
};

//manament branch
export const getAllBranch = (data) => {
  return api.get(`${url.API_BRANCH_GET_ALL}`, data);
};

export const inserBranch = (data) => {
  return api.post(`${url.API_BRANCH_INSERT}`, data);
};

export const updateBranch = (data) => {
  return api.put(url.API_BRANCH_UPDATE, data);
};

export const deleteBranch = (data) => {
  return api.delete(`${url.API_BRANCH_DELETE}?id=${data}`);
};

//manament catagory
export const getCategoryPaging = (data) => {
  return api.get(`${url.API_CATEGORY_GET_PAGING}`, data);
};

export const getAllCategory = (data) => {
  return api.get(`${url.API_CATEGORY_GET_ALL}`, data);
};

export const inserCategory = (data) => {
  return api.post(`${url.API_CATEGORY_INSERT}`, data);
};

export const updateCategory = (data) => {
  return api.put(url.API_CATEGORY_UPDATE, data);
};

export const deleteCategory = (data) => {
  return api.delete(`${url.API_CATEGORY_DELETE}?id=${data}`);
};
