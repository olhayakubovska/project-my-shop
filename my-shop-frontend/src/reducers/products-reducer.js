import { ACTION_TYPE } from "./action/action-type";

const initialStateProducts = {
  products: [],
};

export const productsReducer = (state = initialStateProducts, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case ACTION_TYPE.SET_CHANGE_PRODUCTS:
      return {
        ...state,
        products: action.payload,

      };

    default:
      return state;
  }
};
