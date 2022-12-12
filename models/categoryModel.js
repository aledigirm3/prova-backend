const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CategorySchema = new mongoose.Schema(
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
    prodotti: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model("Category", CategorySchema, "Categorys");

module.exports = { CategorySchema, CategoryModel };
