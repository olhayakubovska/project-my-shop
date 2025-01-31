import { ACTION_TYPE } from "./action-type";

export const changeProductsAction = (products) => ({
  type: ACTION_TYPE.SET_CHANGE_PRODUCTS,
  payload: products,
});
