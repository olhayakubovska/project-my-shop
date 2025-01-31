import { ACTION_TYPE } from "./action-type";

export const setChangeUserAction = (user) => ({
  type: ACTION_TYPE.SET_CHANGE_USER,
  payload: user,
});
