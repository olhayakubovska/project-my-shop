import mongoose from "mongoose";
import validator from "validator";

const BasketSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  productId: {
    type: String,
    required: true,
  },

  productImage: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Image should be a valid URL",
    },
  },

  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Number,
    required: true,
  },
});

const Basket = mongoose.model("Basket", BasketSchema);
export default Basket;
