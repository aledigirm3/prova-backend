const { Controller } = require("express-toolkit");
const { CartModel } = require("../models/cartModel");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const ErrorResponse = require("../utils/errorResponse");
const myController = new Controller({
  model: CartModel,
  name: "Carts",
});

//AGGIUNGE UN PRODOTTO AL CARRELLO
myController.addProduct = (req, res, next) => {
  CartModel.findById(req.user.carrello)
    .then(async (result) => {
      console.log(req.user.carrello);
      if (result.prodotti.includes(req.body.id)) {
        return next(
          new ErrorResponse("Prodotto già presente nel carrello", 500)
        );
      }
      result.prodotti.push(req.body.id);
      await result.save();
      res.status(200).json({
        success: true,
        message: "prodotto aggiunto",
      });
    })
    .catch((err) => {
      return next(err);
    });
};

//VISUALIZZA I PRODOTTI PER ESTESO (.populate)
myController.displayProduct = (req, res, next) => {
  CartModel.findById(req.user.carrello)
    .populate("prodotti")
    .then((result) => {
      res.status(201).json({
        success: true,
        result,
      });
    })
    .catch((error) => {
      return next(error);
    });
};

//RIMUOVE UN SINGOLO PRODOTTO DAL CARRELLO
myController.removeProduct = (req, res, next) => {
  CartModel.findById(req.user.carrello)
    .then(async (result) => {
      const pos = result.prodotti.indexOf(req.body.id);
      if (pos === -1) {
        return next(
          new ErrorResponse("Prodotto non presente nel carrello", 500)
        );
      }
      result.prodotti.splice(pos, 1);
      await result.save();
      res.status(201).json({
        success: true,
        message: "prodotto rimosso",
      });
    })
    .catch((error) => {
      return next(error);
    });
};

//SVUOTA IL CARRELLO
myController.removeAllProduct = (req, res, next) => {
  CartModel.findById(req.user.carrello)
    .then(async (result) => {
      result.prodotti = [];
      await result.save();
      res.status(200);
    })
    .catch((err) => {
      return next(err);
    });
};

//=====================================HOOK EXPRESS-TOOLKIT======================================
myController.registerHook("pre:updateById", isAuthenticated);
myController.registerHook("pre:updateById", isAdmin);

myController.registerHook("pre:update", isAuthenticated);
myController.registerHook("pre:update", isAdmin);

myController.registerHook("pre:deleteById", isAuthenticated);
myController.registerHook("pre:deleteById", isAdmin);

myController.registerHook("pre:delete", isAuthenticated);
myController.registerHook("pre:delete", isAdmin);

myController.registerHook("pre:patchById", isAuthenticated);
myController.registerHook("pre:patchById", isAdmin);

myController.registerHook("pre:replaceById", isAuthenticated);
myController.registerHook("pre:replaceById", isAdmin);

myController.registerHook("pre:create", isAuthenticated);
myController.registerHook("pre:create", isAdmin);

myController.registerHook("pre:find", isAuthenticated);
myController.registerHook("pre:find", isAdmin);

myController.registerHook("pre:findById", isAuthenticated);

module.exports = myController;
