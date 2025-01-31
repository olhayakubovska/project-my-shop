export const basketMap = (product) => {
  return {
    id: product._id,
    userId: product.userId,
    productId: product.productId,
    productImage: product.productImage,
    productName: product.productName,
    productPrice: product.productPrice,
    productDescription: product.productDescription,
    categoryId: product.categoryId,
  };
};
