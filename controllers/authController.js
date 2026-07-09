const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const generateToken = require("../utils/generateToken");

// Register
const registerUser = async (req, res) => {
  try {
    const { username, name, email, password, age } = req.body;

    // Basic sanity: model requires username/email/password/age is optional.
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // NOTE: schema does not have `name`, but existing UI sends it.
    // We keep it out of the DB update to avoid changing schema/business logic.
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      age,
    });

    // Keep response shape consistent with existing README/UI.
    res.status(201).json({ success: true, message: "Registration Successful", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    const token = generateToken(user);

    // Keep cookie name/behavior compatible with authMiddleware/pageAuthMiddleware.
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Preserve redirect logic expected by login.ejs.
    // README suggests admins go to /admin/dashboard. Others to /dashboard.
    const redirect = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

    res.json({ success: true, redirect });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Logout
const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.redirect("/login");
  } catch (err) {
    return res.redirect("/login");
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};

