export const API_LOGIN = "/user/login";
export const API_GAUTH_AUTHENTICATE = "/GAuth/Authenticate";

//Management account
export const API_ROLE_GET_ALL = "/role/getall?sort=desc";
export const API_ROLE_INSERT = "/role/insert";
export const API_ROLE_UPDATE = "/role/update";
export const API_ROLE_DELETE = "/role/delete";
export const API_ACTION_GET_BY_ROLE_ID = "/Action/GetByRoleId";
export const API_ACTION_GET_ALL = "/Action/GetAll?sort=DESC";
export const API_ROLE_ACTION_INSERT_MANY = "RoleAction/InsertMany";

//Media server
export const API_MEDIA_GET_ALL_FILE_BY_COLLECTIONID = "/file/getbycollectionid";
export const API_MEDIA_DELETE_FILE = "/file/delete";

//Management branch
export const API_BRANCH_GET_ALL = "/Branch/GetPaging";
export const API_BRANCH_INSERT = "/Branch/Insert";
export const API_BRANCH_UPDATE = "/Branch/Update";
export const API_BRANCH_DELETE = "/Branch/Delete";
