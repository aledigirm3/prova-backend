const { buildRouter } = require("express-toolkit");
const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

const router = buildRouter({
  controller: authController,
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

/*  router.post('/signin', utils.asyncMiddleware( async (req,res,next) => {
  console.log(UserController)
  const user = await UserController.signin(req,res,next)
  console.log(user)
  res.status(200).json({
    success: true,
    user
  })
}))  */
router.post("/actions/signin", authController.signin);
router.get("/actions/logout", authController.logout);
router.get("/actions/getme", isAuthenticated, authController.getUserProfile);
module.exports = router;
