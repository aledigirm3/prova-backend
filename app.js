//backtick: `
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); //cookie su cui salvare il token
const errorHandler = require("./middleware/error");
const cors = require("cors");
require("dotenv").config(); //maschero il link del database e della porta presenti

//MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

//ROUTES MIDDLEWARE
app.use("/auth", authRoute);

//ERROR MIDDLEWARE
app.use(errorHandler);

const port = process.env.PORT || 8000;

mongoose.connect(process.env.DATABASE, function (err) {
  if (err) {
    console.error("Can not connect:", err);
  } else {
    app.listen(port, () => {
      console.log(`Connecte at port: ${port}`);
    });
  }
});
