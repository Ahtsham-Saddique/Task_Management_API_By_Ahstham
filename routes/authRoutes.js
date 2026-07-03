const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const {

    registerValidation

} = require("../validators/authValidator");

const validate = require("../middleware/validate");


// Register

router.post(

    "/register",

    registerValidation,

    validate,

    authController.registerUser

);
router.post("/login", authController.loginUser);
router.get("/register", (req, res) => {

    res.send("Register Route Working");

});
router.get("/logout", authController.logoutUser);





module.exports = router;