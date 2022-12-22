const { Controller } = require("express-toolkit");
const { ProductModel } = require("../models/productModel");
const errorResponse = require("../utils/errorResponse");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const myController = new Controller({
  model: ProductModel,
  name: "Products",
});

//stampa dei prodotti con tutti i campi della categoria
myController.displayProduct = (req, res, next) => {
  ProductModel.find()
    .populate("category")
    .then((result) => {
      res.status(201).json({
        success: true,
        result,
      });
    })
    .catch((err) => {
      return next(err);
    });
};
//ricerca con paginazione integrata (se deciso da frontend)
myController.displaySearchProduct = (req, res, next) => {
  const limit = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const query = {};
  if (req.query.name) {
    query.name = new RegExp(`^${req.query.name}`, "i");
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  ProductModel.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("category")
    .then((result) => {
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

myController.registerHook("pre:create", isAuthenticated);
myController.registerHook("pre:create", isAdmin);
myController.registerHook("pre:create", (req, res, next) => {
  if (req.body.category === "") {
    return next(new errorResponse("Perfavore, selezionare una categoria", 400));
  }
  next();
});

myController.registerHook("pre:count", (req, res, next) => {
  req.query.name = new RegExp(`^${req.query.name}`, "i");
  next();
});

module.exports = myController;
