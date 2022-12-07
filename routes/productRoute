const { buildRouter } = require("express-toolkit");
const productController = require("../controllers/productController");

const router = buildRouter({
  controller: productController,
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
module.exports = router;
