const { Controller } = require("express-toolkit");
const { CategoryModel } = require("../models/categoryModel");
const myController = new Controller({
  model: CategoryModel,
  name: "Categorys",
});

module.exports = myController;
