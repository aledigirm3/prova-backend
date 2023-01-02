// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  //mongoose bad ObjectId
  if (err.name === "CastError") {
    if (req.originalUrl.includes("/category")) {
      err.message = "Categoria inesistente";
      err.statusCode = 400;
    } else if (req.originalUrl.includes("/product")) {
      err.message = "Prodotto inesistente";
      err.statusCode = 404;
    } else {
      err.message = "Utente inesistente";
      err.statusCode = 404;
    }
  }
  //chiave univoca non rispettata
  if (err.code === 11000) {
    if (req.originalUrl === "/category") {
      err.message = "Categoria gia presente!";
      err.statusCode = 400;
    } else {
      err.message = "Esiste già un utente associato a questa email";
      err.statusCode = 400;
    }
  }

  //validation errors (implementate nel modello) for only error name
  //err.name === "ValidationError" non possibile a causa della gestione degli errori di express-toolkit*
  if (err.name === "BadRequest") {
    err.message = err.message.slice(err.message.indexOf(":") + 1).trim(); //*Object.values(err.errors).map((value) => value.message);
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server error",
  });
};

module.exports = errorHandler;
