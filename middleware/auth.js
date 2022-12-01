const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new errorResponse("Devi prima autenticarti", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id);
    next();
  } catch (error) {
    return next(new errorResponse("Devi prima autenticarti", 401));
  }
};
