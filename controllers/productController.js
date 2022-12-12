const { Controller } = require("express-toolkit");
const { ProductModel } = require("../models/productModel");
//const { CategoryModel } = require("../models/categoryModel");
const errorResponse = require("../utils/errorResponse");
const myController = new Controller({
  model: ProductModel,
  name: "Products",
});

//stampa dei prodotti con tutti i campi della categoria
myController.displayProduct = async (req, res, next) => {
  ProductModel.find()
    .populate("category")
    .then((result) => {
      console.log(result);
      res.status(201).json({
        success: true,
        result,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

//=====================================HOOK EXPRESS-TOOLKIT======================================

myController.registerHook("pre:create", (req, res, next) => {
  if (req.body.category === "") {
    return next(new errorResponse("Perfavore, selezionare una categoria", 400));
  }
  next();
});

/* 
myController.registerHook("post:create", (req, res, next) => {
  CategoryModel.findById(res.req.body.categoria)
    .then((result) => {
      console.log(result);
      console.log(res.req.body);
      console.log(typeof result.prodotti);
      result.prodotti.push(res.req.body.categoria);
      next();
    })
    .catch((err) => {
      next(new errorResponse(err.message, 500));
    });
}); */

module.exports = myController;
