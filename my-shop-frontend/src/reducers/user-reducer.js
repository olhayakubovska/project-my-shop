import { ROLE } from "../constants";
import { ACTION_TYPE } from "./action/action-type";

const initialStateUser = {
  id: null,
  login: null,
  roleId: ROLE.GUEST,
};

export const UserReducer = (state = initialStateUser, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_USER:
      return {
        ...state,
        ...action.payload,
      };

    case ACTION_TYPE.LOGOUT:
      return initialStateUser;
    default:
      return state;
  }
};
