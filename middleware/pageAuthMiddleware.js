const jwt = require("jsonwebtoken");
const User = require("../models/users");

const pageAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {

            return res.redirect("/login");

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.redirect("/login");

        }

        req.user = user;

        next();

    }

    catch (err) {

        return res.redirect("/login");

    }

};

module.exports = pageAuthMiddleware;
