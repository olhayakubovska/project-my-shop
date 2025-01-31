import { ACTION_TYPE } from "./action-type";

export const logout = () => {
  return {
    type: ACTION_TYPE.LOGOUT,
  };
};
