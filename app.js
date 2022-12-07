const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); //cookie su cui salvare il token
const errorHandler = require("./middleware/error");
const cors = require("cors");
require("dotenv").config(); //maschero il link del database e della porta presenti

//IMPORT ROUTES
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");

//MIDDLEWARE
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

//ROUTES MIDDLEWARE
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);

//ERROR MIDDLEWARE
app.use(errorHandler);

const port = process.env.PORT || 8000;

//CONNECT DATABASE
mongoose.connect(process.env.DATABASE, function (err) {
  if (err) {
    console.error("Can not connect:", err);
  } else {
    app.listen(port, () => {
      console.log(`Connecte at port: ${port}`);
    });
  }
});
