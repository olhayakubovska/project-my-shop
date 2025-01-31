import { ACTION_TYPE } from "./action/action-type";

const initialStateUsers = {
  users: [],
};

export const UsersReducer = (state = initialStateUsers, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_CHANGE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload._id ? action.payload : user
        ),
      };

    case ACTION_TYPE.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};
