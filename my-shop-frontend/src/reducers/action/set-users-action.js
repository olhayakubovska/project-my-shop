import { ACTION_TYPE } from "./action-type";

export const setUsersAction = (data) => ({
  type: ACTION_TYPE.SET_USERS,
  payload: data,
});
