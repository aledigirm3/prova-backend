const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

//middleware autenticazione
exports.isAuthenticated = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next(new errorResponse("Devi prima autenticarti", 401));
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id);
    next();
  } catch (error) {
    return next(new errorResponse("Devi prima autenticarti", 401));
  }
};

//middleware admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next(new errorResponse("Accesso negato", 401));
  }
  next();
};
