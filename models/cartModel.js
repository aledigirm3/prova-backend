const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//la qty va implementata qui se richiesto
const CartSchema = new mongoose.Schema(
  {
    prodotti: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", CartSchema, "Carts");

module.exports = { CartSchema, CartModel };
