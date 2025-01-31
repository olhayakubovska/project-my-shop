import Basket from "../model/Basket.js";

export const addProductFromBasket = async (product, userId) => {
  await Basket.create(product);
  const userProductsFromBasket = await Basket.find({ userId });
  return userProductsFromBasket;
};

export const getUserProductsFromBasket = async (userId) => {
  const userProductsFromServer = await Basket.find({ userId });
  return userProductsFromServer;
};
