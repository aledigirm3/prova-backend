const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model("Category", CategorySchema, "Categorys");

module.exports = { CategorySchema, CategoryModel };
