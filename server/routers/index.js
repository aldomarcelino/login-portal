const express = require("express");
const authentication = require("../middleware/authentication");
const errorHandler = require("../middleware/error-handler");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.post("/auth/signup", userController.signUp);
router.post("/auth/login", userController.signIn);
router.post("/auth/google", userController.signInWithGoogle);
router.get("/email/verification", userController.sendVerification);
router.get("/auth/facebook", userController.signInWithFacebook);
router.get("/auth/facebook/callback", userController.facebookCallback);
router.get("/auth/verify/:token", userController.accountVerificarion);
router.use(authentication);
router.get("/auth/logout", userController.logOut);
router.get("/users", userController.getAllUsers);
router.use(errorHandler);

module.exports = router;
