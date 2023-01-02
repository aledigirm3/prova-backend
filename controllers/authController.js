const { Controller } = require("express-toolkit");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const errorResponse = require("../utils/errorResponse");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const myController = new Controller({
  model: UserModel,
  name: "Users",
});
//LOGIN
myController.signin = async (req, res, next) => {
  try {
    //controllo esistenza campi nella richiesta
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new errorResponse("email e password sono campi obbligatori", 400)
      );
    }
    //controllo correttezza email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new errorResponse("Invalid credential", 500));
    }
    //controllo correttezza password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new errorResponse("Invalid credential", 500));
    }

    generateToken(user, 200, res);
  } catch (error) {
    return next(error);
  }
};

//GET MY PROFILE
myController.getUserProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
};

//LOGOUT
myController.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({
    success: true,
    message: "logged out",
  });
};

//=====================================FUNZIONI AUSILIARIE======================================
//genera il token e lo inserisce in un cookie
const generateToken = async (user, statusCode, res) => {
  //genero il token
  const token = await user.jwtGenerateToken();
  //creo opzioni per il cookie
  const options = {
    //httpOnly: true, //accesso solo con http per evitare furti di cookie (attacco cross-site scripting)
    expires: new Date(Date.now() + Number(process.env.EXPIRE_TOKEN)), //scadenza cookie
  };

  res
    .status(statusCode)
    .cookie("accessToken", token, options)
    .json({ success: true, token });
};

//=====================================HOOK EXPRESS-TOOLKIT======================================

myController.registerHook("pre:updateById", isAuthenticated);
myController.registerHook("pre:updateById", isAdmin);

myController.registerHook("pre:updateByQuery", isAuthenticated);
myController.registerHook("pre:updateByQuery", isAdmin);

myController.registerHook("pre:deleteById", isAuthenticated);
myController.registerHook("pre:deleteById", isAdmin);

myController.registerHook("pre:deleteByQuery", isAuthenticated);
myController.registerHook("pre:deleteByQuery", isAdmin);

myController.registerHook("pre:patchById", isAuthenticated);
myController.registerHook("pre:patchById", isAdmin);

myController.registerHook("pre:replaceById", isAuthenticated);
myController.registerHook("pre:replaceById", isAdmin);

myController.registerHook("pre:find", isAuthenticated);
myController.registerHook("pre:find", isAdmin);

myController.registerHook("pre:findById", isAuthenticated);
myController.registerHook("pre:findById", isAdmin);

module.exports = myController;
