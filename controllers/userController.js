const { Controller } = require("express-toolkit");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const errorResponse = require("../utils/errorResponse");
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

//LOGOUT
myController.logout = (req, res) => {
  res.clearCookie("token");
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
    httpOnly: true, //accesso solo con http per evitare furti di cookie (attacco cross-site scripting)
    expires: new Date(Date.now() + Number(process.env.EXPIRE_TOKEN)), //scadenza cookie
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

//=====================================HOOK EXPRESS-TOOLKIT======================================

module.exports = myController;
