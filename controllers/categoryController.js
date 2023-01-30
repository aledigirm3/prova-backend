const { Controller } = require("express-toolkit");
const { CategoryModel } = require("../models/categoryModel");
const { ProductModel } = require("../models/productModel");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const myController = new Controller({
  model: CategoryModel,
  name: "Categorys",
});

//=====================================HOOK EXPRESS-TOOLKIT======================================
myController.registerHook("pre:updateById", isAuthenticated);
myController.registerHook("pre:updateById", isAdmin);

myController.registerHook("pre:update", isAuthenticated);
myController.registerHook("pre:update", isAdmin);

myController.registerHook("pre:deleteById", isAuthenticated);
myController.registerHook("pre:deleteById", isAdmin);
myController.registerHook("post:deleteById", async (req, res, next) => {
  const idCategory = req.params.id;
  await ProductModel.deleteMany({ category: idCategory });
  next();
});

myController.registerHook("pre:delete", isAuthenticated);
myController.registerHook("pre:delete", isAdmin);

myController.registerHook("pre:patchById", isAuthenticated);
myController.registerHook("pre:patchById", isAdmin);

myController.registerHook("pre:replaceById", isAuthenticated);
myController.registerHook("pre:replaceById", isAdmin);

myController.registerHook("pre:create", isAuthenticated);
myController.registerHook("pre:create", isAdmin);

module.exports = myController;
