const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.prodotti.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
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
    success_url: `${process.env.CLIENT_URL}/user/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });
  res.send({ url: session.url });
});

router.post("/create-checkout-session-product", async (req, res) => {
  const product = req.body.product;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
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
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  res.send({ url: session.url });
});

module.exports = router;
