const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema, "Products");

module.exports = { ProductSchema, ProductModel };
