const express = require("express");
const Stripe = require("stripe");
const { isAuthenticated } = require("../middleware/auth");
const cartController = require("../controllers/cartController");
const ErrorResponse = require("../utils/errorResponse");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post(
  "/create-checkout-session",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const line_items = req.body.prodotti.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              //images: [product.image],
              metadata: {
                id: product._id,
              },
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        };
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.SERVER_URL}/stripe/checkout-success/${req.headers.authorization}`,
        cancel_url: `${process.env.CLIENT_URL}/user/checkout-failed`,
      });
      res.send({ url: session.url });
    } catch (error) {
      return next(
        new ErrorResponse("Non sono presenti prodotti nel carrello", 500)
      );
    }
  }
);

router.post(
  "/create-checkout-session-product",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const product = await req.body.product;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                //images: [product.image],
                metadata: {
                  id: product._id,
                },
              },
              unit_amount: product.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/user/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/user/checkout-failed`,
      });
      res.send({ url: session.url });
    } catch (error) {
      console.log(error);
      return next(new ErrorResponse("Nessun prodotto selezionato", 500));
    }
  }
);

router.get(
  "/checkout-success/:token",
  (req, res, next) => {
    req.headers.authorization = req.params.token;
    next();
  },
  isAuthenticated,
  async (req, res, next) => {
    try {
      await cartController.removeAllProduct(req, res, next);
      res.redirect(`${process.env.CLIENT_URL}/user/checkout-success`);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
