const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const authController = require('../controllers/auth.controller')

router.post("/sign-up", authController.signUp );

router.post("/sign-in",  authController.signIn);

router.get("/me", verifyToken, authController.verifyUser);

router.patch("/me", verifyToken, authController.updateUser);

module.exports = router;
