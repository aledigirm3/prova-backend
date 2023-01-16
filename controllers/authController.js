const { Controller } = require("express-toolkit");
const { UserModel } = require("../models/userModel");
const { CartModel } = require("../models/cartModel");
const bcrypt = require("bcryptjs");
const errorResponse = require("../utils/errorResponse");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const myController = new Controller({
  model: UserModel,
  name: "Users",
});

//=============SET GESTORE INVIO MAIL (nodemailer)=============
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//=============================================================
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
    if (user.role === -1) {
      const confirmToken = await user.jwtGenerateToken();
      const url = `http://localhost:8000/auth/actions/confirmation/${confirmToken}`;
      mailTransporter.sendMail({
        to: req.body.email,
        subject: "Conferma email MERN",
        html: `Clicca sul link e conferma la mail: <a href="${url}">Conferma</a>`,
      });
      return next(
        new errorResponse(
          "Conferma la tua mail prima di accedere (è stata reinviata una mail)",
          500
        )
      );
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

//CONFERMA EMAIL
myController.confirmation = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await UserModel.findByIdAndUpdate(decoded.id, { role: 0 })
      .then(async (result) => {
        if (!result.carrello) {
          let cart = new CartModel();
          await cart.save();
          await UserModel.findByIdAndUpdate(result._id, { carrello: cart._id });
        }

        return res.redirect(`http://localhost:3000/signin`);
      })
      .catch(() => {
        return res.redirect(`http://localhost:3000/signin`);
      });
  } catch (error) {
    return res.redirect(`http://localhost:3000/signin`);
  }
};

//RECUPERA PASSWORD CON MAIL
myController.forgotPassword = async (req, res, next) => {
  console.log(req.body);
  UserModel.findOne({ email: req.body.email })
    .then(async (user) => {
      const token = await user.jwtGenerateTokenBreve();
      const url = `http://localhost:3000/reset/password/${token}`;
      mailTransporter.sendMail({
        to: req.body.email,
        subject: "Recupera password MERN",
        html: `Clicca sul link e conferma la mail: <a href="${url}">Recupera password</a>`,
      });
      res.status(200).json({
        success: true,
        message: "email sended",
      });
    })
    .catch((error) => {
      console.log(error);
      next(new errorResponse("email non valida", 500));
    });
};

//UPDATE PASSWORD
myController.updatePassword = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    user.set("password", req.body.password);
    await user.save();
    res.status(200).json({
      success: true,
      message: "password changed",
    });
  } catch (error) {
    next(error);
  }
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
myController.registerHook("pre:deleteById", async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  await CartModel.findByIdAndDelete(user.carrello);
  next();
});

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

//===HOOK INVIO MAIL DI CONFERMA===
myController.registerHook("post:create", async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  const confirmToken = await user.jwtGenerateToken();
  const url = `http://localhost:8000/auth/actions/confirmation/${confirmToken}`;
  mailTransporter.sendMail({
    to: req.body.email,
    subject: "Conferma email MERN",
    html: `Clicca sul link e conferma la mail: <a href="${url}">Conferma</a>`,
  });
  next();
});

//=============================================================================================
module.exports = myController;
