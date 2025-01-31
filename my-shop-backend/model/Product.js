import mongoose from "mongoose";
import validator from "validator";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Image should be a valid URL",
    },
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

