const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); //cookie su cui salvare il token
const errorHandler = require("./middleware/error");
const cors = require("cors");
require("dotenv").config();
//limita le richieste
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 2500, // time
  max: 20, // Limit each IP to 100 requests per `window` (here, per Xtime minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
//IMPORT ROUTES
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");

//MIDDLEWARE
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(limiter);
app.use(cookieParser());
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
