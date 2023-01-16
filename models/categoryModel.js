const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      unique: true,
      maxlength: 32,
    },
    description: {
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
