export const productMap = (user) => {
  return {
    categoryId: user.categoryId,
    description: user.description,
    image: user.image,
    name: user.name,
    price: user.price,
    id: user._id,
  };
};
