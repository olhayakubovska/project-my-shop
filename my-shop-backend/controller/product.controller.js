import Basket from "../model/Basket.js";
import Product from "../model/Product.js";

export const addProduct = async (product) => {
  await Product.create(product);
  const products = await Product.find();

  return products;
};

export const getProducts = async () => {
  const products = await Product.find();
  return products;
};

export const getProductsByCategory = async (categoryId, page, limit) => {
  const offset = (page - 1) * limit;

  const [productsByCategoryId, count] = await Promise.all([
    Product.find({ categoryId }).skip(offset).limit(limit),
    Product.countDocuments({ categoryId }),
  ]);

  const lastPage = Math.ceil(count / limit);
  return { productsByCategoryId, lastPage };
};

export const getProduct = async (id) => {
  const product = await Product.findOne({ _id: id });
  return product;
};

export const catigories = () => {
  const categories = [
    {
      id: "1",
      category: "Обувь",
    },
    {
      id: "2",
      category: "Женские свитера",
    },
    {
      id: "3",
      category: "Мужская одежда",
    },
    {
      id: "4",
      category: "Детская одежда",
    },
    {
      id: "5",
      category: "Юбки",
    },
    {
      id: "6",
      category: "Платья",
    },
    {
      id: "7",
      category: "Штаны",
    },
    {
      id: "8",
      category: "Футболки",
    },
  ];
  return categories;
};


export const updateProduct = async (productId, newProduct) => {
  const updatedData = { ...newProduct };
  await Product.updateOne({ _id: productId }, { $set: updatedData });
  const products = await Product.find();

  return products;
};

export const deleteProduct = async (productId) => {
  await Product.deleteOne({ _id: productId });
  const products = await Product.find();
  return products;
};
export const deleteProductFromBasket = async (idForRemove, userId) => {
  await Basket.deleteOne({ _id: idForRemove });
  const products = await Basket.find({ userId });
  return products;
};
