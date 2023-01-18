const { buildRouter } = require("express-toolkit");
const cartController = require("../controllers/cartController");
const { isAuthenticated } = require("../middleware/auth");

const router = buildRouter({
  controller: cartController,
  endpoints: {
    find: true,
    findById: true,
    create: true,
    updateById: true,
    updateByQuery: true,
    deleteById: true,
    deleteByQuery: true,
    count: true,
    patchById: true,
    replaceById: true,
  },
});

router.post("/actions/addproduct", isAuthenticated, cartController.addProduct);
router.put(
  "/actions/removeproduct",
  isAuthenticated,
  cartController.removeProduct
);
router.get(
  "/actions/displayproduct",
  isAuthenticated,
  cartController.displayProduct
);

router.put(
  "/actions/removeproduct/all",
  isAuthenticated,
  cartController.removeAllProduct
);

module.exports = router;
