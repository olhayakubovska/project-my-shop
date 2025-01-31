import { ACTION_TYPE } from "./action-type";

export const removeItemFromItem = (productId) => ({
  type: ACTION_TYPE.REMOVE_PRODUCT_FROM_BASKET,
  payload: productId,
});
