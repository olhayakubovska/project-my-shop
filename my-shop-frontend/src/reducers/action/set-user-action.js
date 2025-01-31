import { ACTION_TYPE } from "./action-type";

export const setUser = (data) => ({
  type: ACTION_TYPE.SET_USER,
  payload: data,
});
