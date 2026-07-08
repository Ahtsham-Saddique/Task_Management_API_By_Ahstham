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
        const message = err?.message || "Internal Server Error";
        res.status(500).json({
            success: false,
            message,
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

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "lax" : "strict",
            secure: isProduction,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            role: user.role,
            redirect: user.role === "admin" ? "/admin/dashboard" : "/dashboard",
        });

    }

    catch (err) {

        console.log(err);
        const message = err?.message || "Internal Server Error";

        return res.status(500).json({
            success: false,
            message,
        });
    }

};

const logoutUser = (req, res) => {

    // Clear cookie across common attribute variations.
    // Browsers will keep the cookie if the delete call doesn't match the original cookie attributes.
    res.clearCookie("token");
    res.clearCookie("token", { path: "/" });
    res.clearCookie("token", { httpOnly: true, path: "/" });

    // Also remove any cookie value by overwriting (defensive; does not affect login/register flows).
    res.cookie("token", "", { httpOnly: true, path: "/", maxAge: 0 });

    res.redirect("/login");

};

module.exports = {

    registerUser,
    loginUser,
    logoutUser


};