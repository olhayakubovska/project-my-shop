import { ACTION_TYPE } from "./action-type";

export const setProductData = (postData) => ({
  type: ACTION_TYPE.SET_PRODUCT_DATA,
  payload: postData,
});
