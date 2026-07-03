const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authMiddleware = async (req, res, next) => {

    try {

        // Read Token From Cookie
        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({

                success: false,
                message: "Please Login First"

            });

        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "User Not Found"

            });

        }

        // Attach User To Request
        req.user = user;

        next();

    }

    catch (err) {

        return res.status(401).json({

            success: false,
            message: "Invalid Token"

        });

    }

};

module.exports = authMiddleware;