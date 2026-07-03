const { body } = require("express-validator");

exports.registerValidation = [

    body("username")

        .notEmpty()

        .withMessage("Username Required"),

    body("email")

        .isEmail()

        .withMessage("Invalid Email"),

    body("password")

        .isLength({

            min: 6

        })

        .withMessage("Minimum 6 Characters")

];