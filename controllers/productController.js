const { Controller } = require("express-toolkit");
const { ProductModel } = require("../models/productModel");
const myController = new Controller({
  model: ProductModel,
  name: "Products",
});

module.exports = myController;
