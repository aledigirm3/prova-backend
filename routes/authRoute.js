const { buildRouter } = require("express-toolkit");
const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");

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

router.post("/actions/signin", authController.signin);
router.get("/actions/logout", authController.logout);
router.get("/actions/clearcookie", authController.clearCookie);
router.get("/actions/getme", isAuthenticated, authController.getUserProfile);
router.get("/actions/confirmation/:token", authController.confirmation);
router.post("/actions/forgotpassword", authController.forgotPassword);
router.put("/actions/update/password/:token", authController.updatePassword);

//=============================================PASSPORT=============================================
router.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
//=============================================FACEBOOK=============================================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/actions/facebook/callback`,
      profileFields: ["id", "displayName", "email"],
    },
    authController.authFacebook
  )
);

//chiamate
router.get(
  "/actions/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/actions/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_URL}/signin`,
  }),
  authController.successfulAuth
);

//==================================================================================================

module.exports = router;
