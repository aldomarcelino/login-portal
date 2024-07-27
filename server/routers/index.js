const express = require("express");
const authentication = require("../middleware/authentication");
const errorHandler = require("../middleware/error-handler");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.post("/auth/signup", userController.signUp);
router.post("/auth/login", userController.signIn);
router.post("/auth/refresh-token", userController.generateAccessToken);
router.post("/auth/google", userController.signInWithGoogle);
router.get("/email/verification", userController.sendVerification);
router.get("/auth/facebook", userController.signInWithFacebook);
router.post("/auth/forgot-password", userController.forgotPassword);
router.post("/auth/change-password", userController.changePassword);
router.post("/auth/logout", userController.logOut);
router.get("/auth/facebook/callback", userController.facebookCallback);
router.get("/auth/verify/:token", userController.accountVerificarion);
router.use(authentication);
router.get("/users", userController.getAllUsers);
router.get("/users/statistic", userController.getUsersStatistic);
router.use(errorHandler);

module.exports = router;
