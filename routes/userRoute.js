const { buildRouter } = require("express-toolkit");
const UserController = require("../controllers/userController");

const router = buildRouter({
  controller: UserController,
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
router.post("/actions/signin", UserController.signin);
router.get("/actions/logout", UserController.logout);
module.exports = router;
