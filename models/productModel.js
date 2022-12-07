const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    descrizione: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 2000,
    },
    prezzo: {
      type: Number,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    categoria: {
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
