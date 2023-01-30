const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

//middleware autenticazione
const isAuthenticated = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  console.log(accessToken);
  if (!accessToken) {
    console.log("no1");
    return next(new errorResponse("Devi prima autenticarti", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id);
    next();
  } catch (error) {
    console.log("no2");
    return next(new errorResponse("Devi prima autenticarti", 401));
  }
};

//middleware admin
const isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next(new errorResponse("Accesso negato", 401));
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
