import { ACTION_TYPE } from "./action/action-type";

const initialStateBasket = {
  basket: [],
};

export const BasketReducer = (state = initialStateBasket, action) => {
  switch (action.type) {
    case ACTION_TYPE.ADD_PRODUCT_TO_BASKET:
      return {
        ...state,
        basket: [...state.basket, action.payload],
      };
    case ACTION_TYPE.REMOVE_PRODUCT_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.payload),
      };

    case ACTION_TYPE.SET_PRODUCTS_FROM_BASKET:
      return {
        ...state,
        basket: action.payload,
      };

    default:
      return state;
  }
};
