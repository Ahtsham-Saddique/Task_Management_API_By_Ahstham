const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const registerUser = async (req, res) => {

    try {

        const { username, name, age, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: "Email already exists"

            });

        }

       const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({

    username,
    name,
    age,
    email,
    password: hashedPassword

});
        

        res.status(201).json({

            success: true,
            message: "User Registered Successfully",
            user:user


        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password"

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password"

            });

        }

        const token = generateToken(user);

        res.cookie("token", token, {

            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        res.status(200).json({

        success: true,

        message: "Login Successful",

        role: user.role,

        redirect:

        user.role === "admin"

            ? "/admin/dashboard"

            : "/dashboard"

         });

    }

    catch (err) {

        console.log(err);

       console.log(err);

     res.status(500).json({
        
        success: false,
        message: "Internal Server Error"

      });

    }

};

const logoutUser = (req, res) => {

    res.clearCookie("token");

    res.redirect("/login");

};

module.exports = {

    registerUser,
    loginUser,
    logoutUser


};