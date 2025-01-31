import { ACTION_TYPE } from "../../src/action-type";

export const addToBasketAction = (product) => ({
  type: ACTION_TYPE.ADD_PRODUCT_TO_BASKET,
  payload: product,
});
