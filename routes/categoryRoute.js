const { buildRouter } = require("express-toolkit");
const categoryController = require("../controllers/categoryController");

const router = buildRouter({
  controller: categoryController,
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
