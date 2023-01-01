export const API_LOGIN = "/user/login";
export const API_GAUTH_AUTHENTICATE = "/GAuth/Authenticate";
export const API_GAUTH_GET_MANUAL_ENTRY_KEYS = "/GAuth/GetAllManualEntryKeys";

//Management account
export const API_ROLE_GET_ALL = "/role/getall?sort=desc";
export const API_ROLE_INSERT = "/role/insert";
export const API_ROLE_UPDATE = "/role/update";
export const API_ROLE_DELETE = "/role/delete";
export const API_ACTION_GET_BY_ROLE_ID = "/Action/GetByRoleId";
export const API_ACTION_GET_ALL = "/Action/GetAll?sort=DESC";
export const API_ROLE_ACTION_INSERT_MANY = "RoleAction/InsertMany";

export const API_USER_GET_PAGING = "/User/GetPaging";
export const API_USER_INSERT = "/User/Insert";
export const API_USER_UPDATE = "/User/Update";
export const API_USER_DELETE = "/User/Delete";

//Media server
export const API_MEDIA_GET_ALL_FILE_BY_COLLECTIONID = "/file/getbycollectionid";
export const API_MEDIA_DELETE_FILE = "/file/delete";
export const API_MEDIA_UPLOAD = "/file/Upload?collectionId=";

//Management branch
export const API_BRANCH_GET_ALL = "/Branch/GetPaging";
export const API_BRANCH_INSERT = "/Branch/Insert";
export const API_BRANCH_UPDATE = "/Branch/Update";
export const API_BRANCH_DELETE = "/Branch/Delete";

//Management category
export const API_CATEGORY_GET_PAGING = "/Category/GetPaging";
export const API_CATEGORY_GET_ALL = "/Category/GetAll";
export const API_CATEGORY_INSERT = "/Category/Insert";
export const API_CATEGORY_UPDATE = "/Category/Update";
export const API_CATEGORY_DELETE = "/Category/Delete";

//Management posts
export const API_POST_GET_PAGING = "/Post/GetPaging";
export const API_POST_INSERT = "/Post/Insert";
export const API_POST_UPDATE = "/Post/Update";
export const API_POST_DELETE = "/Post/Delete";
